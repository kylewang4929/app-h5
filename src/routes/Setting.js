import React, { Component } from 'react';
import { connect } from 'dva';
import { List, Switch } from 'antd-mobile';
import BackButton from '../containers/MenuButton/BackButton';
import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';

const Item = List.Item;


const styles = {
  list: {
    marginTop: '0.3rem',
  },
  container: {
  },
  tipsText: {
    fontSize: '0.32rem',
    paddingRight: '0.1rem',
  },
};

class Setting extends Component {
  render() {
    return (
      <div>
        <NavBar
          title="SETTING"
          leftButton={<BackButton />}
        />
        <MenuPage style={styles.container}>
          <List className="my-list" style={styles.list}>
            <Item extra={<Switch checked />}>声音</Item>
            <Item extra={<Switch checked />}>振动</Item>
          </List>

          <List className="my-list" style={styles.list}>
            <Item extra={<Switch checked={false} />}>App消息通知</Item>
          </List>

          <List className="my-list" style={styles.list}>
            <Item extra={<span style={styles.tipsText}>12.8MB</span>}>清理缓存</Item>
          </List>
        </MenuPage>
      </div>
    );
  }
}

Setting.propTypes = {
};

function mapStateToProps(state) {
  return {
  };
}


export default connect(mapStateToProps)(Setting);
