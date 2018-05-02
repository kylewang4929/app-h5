import React, { Component } from 'react';


const styles = {
  wap: {
    backgroundColor: '#47a296',
    padding: '.14rem 0',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  it: {
    height: '100%',
    width: '16.3333333%',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '.22rem',
    color: '#fff',
  },
};
const colums = [
  {
    name: 'name',
    label: '名称',
  },
  {
    name: 'signal',
    label: '信号',
  },
  {
    name: 'dang',
    label: '档位',
  },
  {
    name: 'yewei',
    label: '液位',
  },
  {
    name: 'remark',
    label: '备注',
  },
  {
    name: 'switch',
    label: '开关',
  },

];
class Columns extends Component {
  state = {

  }
  render() {
    return (
      <div style={styles.wap}>
        {
            colums.map((v) => {
              return <div key={v.name} style={styles.it}>{v.label}</div>;
            })
        }
      </div>
    );
  }
}

export default Columns;
