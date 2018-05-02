import React, { Component } from 'react';
import { SearchBar } from 'antd-mobile';

require('./index.less');

const styles = {
  wap: {
    backgroundColor: 'rgb(2, 196, 177)',
  },
  dn: {
    textAlign: 'center',
    paddingTop: '.3rem',
    color: '#fff',
    fontSize: '.24rem',
  },
  num: {
    textAlign: 'center',
    paddingTop: '.1rem',
    color: '#fdf005',
    fontSize: '.6rem',
  },
  sub: {
    textAlign: 'center',
    bottom: 0,
    fontSize: '40%',
    color: '#fff',
  },
};

class SearchContain extends Component {
  state = {

  }
  render() {
    const { dvList, onSubmit } = this.props;
    return (
      <div style={styles.wap} className="search_contain">
        <div style={styles.dn}>设备总数</div>
        <div style={styles.num}>{dvList.length}<sub style={styles.sub}>台</sub></div>
        <SearchBar placeholder="设备名称、关键词" onSubmit={v => onSubmit(v)} />
      </div>
    );
  }
}

export default SearchContain;
