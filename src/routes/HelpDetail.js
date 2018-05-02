import React, { Component } from 'react';
import { connect } from 'dva';
import { List, WhiteSpace } from 'antd-mobile';
import BackButton from '../containers/MenuButton/BackButton';
import config from '../config/template';
import Scroll from '../components/Scroll';
import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';

const helpConfig = config.help;
const Item = List.Item;

const styles = {
  container: {
  },
  title: {
    fontWeight: 'bold',
  },
  content: {
    fontSize: '0.28rem',
    lineHeight: '20px',
    color: '#737373',
  },
  contentImage: {
    width: '100%',
    display: 'block',
    height: 'auto',
  },
  icon: {
    width: '0.5rem',
    height: 'auto',
    marginRight: '0.22rem',
    position: 'relative',
    top: '-0.02rem',
  },
};

class HelpDetail extends Component {
  // 查找配置文件
  getItem = (parentId, id) => {
    let obj = {};
    helpConfig.content.map((item, index) => {
      if (item.id === parentId) {
        // 父id 匹配
        item.content.map((subItem, subIndex) => {
          if (subItem.id === id) {
            obj = subItem;
          }
        });
      }
    });
    return obj;
  }

  render() {
    const { params } = this.props;
    const { parentID, ID} = params;
    const content = this.getItem(parentID, ID);
    return (
      <div>
        <NavBar
          title="HELP_DETAIL"
          leftButton={<BackButton />}
        />
        <MenuPage style={styles.container}>
          <Scroll bounce>
            <WhiteSpace />
            <List className="my-form">
              <Item style={styles.title}>{content.title}</Item>
              {
                content.value.map((item, index) => {
                  if (item.type === 'string') {
                    return (
                      <Item key={index} multipleLine wrap style={styles.content}>
                        <span>{item.value}</span>
                      </Item>
                    );
                  }
                  if (item.type === 'image') {
                    return (
                      <Item key={index} multipleLine wrap style={styles.content}>
                        <img src={item.value} style={styles.contentImage} />
                      </Item>
                    );
                  }
                })
              }
              {
                content.value.map((item, index) => {
                  if (item.type === 'string') {
                    return (
                      <Item key={index} multipleLine wrap style={styles.content}>
                        <span>{item.value}</span>
                      </Item>
                    );
                  }
                  if (item.type === 'image') {
                    return (
                      <Item key={index} multipleLine wrap style={styles.content}>
                        <img src={item.value} style={styles.contentImage} />
                      </Item>
                    );
                  }
                })
              }
            </List>
          </Scroll>
        </MenuPage>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    language: state.language,
  };
}

export default connect(mapStateToProps)(HelpDetail);
