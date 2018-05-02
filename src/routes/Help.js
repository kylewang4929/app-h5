import React, { Component } from 'react';
import { connect } from 'dva';
import { List } from 'antd-mobile';
import BackButton from '../containers/MenuButton/BackButton';
import router from '../utils/router';
import config from '../config/template';
import Scroll from '../components/Scroll';
import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';

const helpConfig = config.help;

const Item = List.Item;

const styles = {
  container: {
    zIndex: 0,
    boxSizing: 'border-box',
  },
};
class Help extends Component {

  onClick = (parentId, id) => {
    router.go(`#/menu/helpDetail/${parentId}/${id}`);
  }

  render() {
    return (
      <div>
        <NavBar
          title="HELP"
          leftButton={<BackButton />}
        />
        <MenuPage style={styles.container}>
          <Scroll bounce>
            {
              helpConfig.content.map((item, index) => {
                return (
                  <List key={index} renderHeader={item.title} className="my-form">
                    {
                      item.content.map((subItem, subIndex) => {
                        return (
                          <Item key={subIndex} onClick={this.onClick.bind(null, item.id, subItem.id)} arrow="horizontal">{subItem.title}</Item>
                        );
                      })
                    }
                  </List>
                );
              })
            }
          </Scroll>
        </MenuPage>
      </div>
    );
  }
}

Help.propTypes = {
};

function mapStateToProps(state) {
  return {
    language: state.language,
  };
}


export default connect(mapStateToProps)(Help);
