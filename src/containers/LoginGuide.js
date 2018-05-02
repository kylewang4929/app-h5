import React, { Component } from 'react';
import { connect } from 'dva';
import WaveBox from '../components/WaveBox';
import ImageLoginGuide from '../components/ImageLoginGuide';
import route from '../utils/router';

const config = require('../config/template');

const styles = {
  contianer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: '0px',
    top: '0px',
  },
};
class LoginGuide extends Component {

  onRegister = () => {
    route.go('#/menu/register');
  }
  onLogin = () => {
    route.go('#/menu/login');
    // route.go('#/menu/mainPage');
  }

  render() {
    // 两种设计，看配置文件
    const { loginStyle } = config.app;
    let dom = null;
    switch (loginStyle) {
      case 0: {
        dom = <WaveBox onRegister={this.onRegister} onLogin={this.onLogin} />;
        break;
      }
      case 1: {
        dom = <ImageLoginGuide onRegister={this.onRegister} onLogin={this.onLogin} />;
        break;
      }
      default: {
        dom = <WaveBox onRegister={this.onRegister} onLogin={this.onLogin} />;
        break;
      }
    }
    return (
      <div style={styles.contianer}>
        {dom}
      </div>
    );
  }
}

LoginGuide.propTypes = {
};

function mapStateToProps(state) {
  return {
  };
}


export default connect(mapStateToProps)(LoginGuide);
