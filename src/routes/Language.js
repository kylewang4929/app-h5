import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { List } from 'antd-mobile';

import NavBar from '../containers/NavBar';

import MenuPage from '../components/MenuPage';
import router from '../utils/router';

import BackButton from '../containers/MenuButton/BackButton';

const Item = List.Item;

const styles = {
  list: {
    margin: '0.2rem 0',
  },
  flagBox: {
    width: '0.4rem',
    height: '0.4rem',
    backgroundColor: '#80c7e8',
    textAlign: 'center',
    lineHeight: '0.4rem',
    borderRadius: '50%',
    position: 'absolute',
    right: '0.4rem',
    top: '50%',
    marginTop: '-0.2rem',
    color: '#fff',
  },
  flagBoxInner: {},
};

class Language extends Component {
  onClick = (key) => {
    const { dispatch } = this.props;
    switch(key) {
      case 'zh': {
        dispatch({
          type: 'language/updateLanguage',
          payload: {
            key: 'zh',
            name: '中文',
          },
        });
        break;
      }
      case 'en': {
        dispatch({
          type: 'language/updateLanguage',
          payload: {
            key: 'en',
            name: 'English',
          },
        });
        break;
      }
    }
    router.goBack(-1);
  }
  render() {
    const { language } = this.props;
    console.log('language', language);
    return (
      <div>
        <NavBar
          title="LANGUAGE"
          leftButton={<BackButton />}
        />
        <MenuPage theme="dark">
          <List className="my-list" style={styles.list}>
            <Item onClick={this.onClick.bind(null, 'zh')}>
              中文
              {
                language.key === 'zh' ? <ActiveFlag /> : null
              }
            </Item>
            <Item onClick={this.onClick.bind(null, 'en')}>
              English
              {
                language.key === 'en' ? <ActiveFlag /> : null
              }
            </Item>
          </List>
        </MenuPage>
      </div>
    );
  }
}

class ActiveFlag extends Component {
  render() {
    return (
      <div style={styles.flagBox}>
        <span className="mdi mdi-check" style={styles.flagBoxInner} />
      </div>
    );
  }
}

Language.propTypes = {
};

Language.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    language: state.language,
  };
}


export default connect(mapStateToProps)(Language);
