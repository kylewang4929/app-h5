import React, { Component } from 'react';
import NonePage from './NonePage';
import TimimgItem from './TimimgItem';
import router from '../../utils/router';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    paddingBottom: '1.4rem',
  },
  wrap: {
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    overflow: 'scroll',
  },
  hd: {
    borderBottom: '3px solid #fafafa',
    paddingBottom: '.1rem',
  },
  hl: {
    fontSize: '.6rem',
    display: 'inline-block',
    padding: '.2rem',
    lineHeight: '.4rem',
    color: '#8b8b8b',
    visibility: 'hidden',
  },
  hr: {
    float: 'right',
    fontSize: '.6rem',
    display: 'inline-block',
    padding: '.2rem',
    lineHeight: '.4rem',
    color: '#00bca8',
  },
};

class Timing extends Component {
  state={
    list: [],
  }
  componentWillMount() {
    const { device, did, deviceData } = this.props;
    const arr = [];
    for (let i = 1; i <= 5; i++) {
      const obj = {};
      obj[`Duan${i}_Display`] = deviceData[did].data[`Duan${i}_Display`];
      obj[`Duan${i}_Switch`] = deviceData[did].data[`Duan${i}_Switch`];
      obj[`Duan${i}_Custom`] = deviceData[did].data[`Duan${i}_Custom`];
      obj[`Duan${i}_WorkingTime`] = deviceData[did].data[`Duan${i}_WorkingTime`];
      obj[`Duan${i}_Grade`] = deviceData[did].data[`Duan${i}_Grade`];
      obj[`Duan${i}_CustomWorking`] = deviceData[did].data[`Duan${i}_CustomWorking`];
      obj[`Duan${i}_CustomPause`] = deviceData[did].data[`Duan${i}_CustomPause`];
      obj[`Duan${i}_Week`] = deviceData[did].data[`Duan${i}_Week`];
      arr.push(obj);
    }
    console.log(arr);
    this.setState({ list: arr });
  }
  onDelete = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timing/deleteTiming',
      payload: data,
    });
  }
  onSwitch = (data, checked) => {

  }
  toDetail = (data, e) => {
    if (e.target.type === 'checkbox') return;
    router.go(`#/menu/addTiming/${data.id}`);
  }
  render() {
    const { device, list } = this.props;
    return (
      <div style={styles.container} >
        {
            list.length ? (
              <div style={styles.wrap}>
                <div style={styles.hd}>
                  <div style={styles.hl}>×</div>
                  <div style={styles.hr} onClick={() => { router.go('#/menu/addTiming/add'); }}>+</div>
                </div>
                {
                    list.map((v) => {
                      return <TimimgItem data={v} key={v.id} onDelete={this.onDelete} onClick={this.toDetail} onSwitch={this.onSwitch} />;
                    })
                  }
              </div>
            ) : <NonePage />
        }
      </div>
    );
  }
}


export default Timing;

