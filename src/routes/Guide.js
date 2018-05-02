import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import GuideCarousel from '../containers/GuideCarousel';
import LoginGuide from '../containers/LoginGuide';
import NavBar from '../containers/NavBar';
import MenuPage from '../components/MenuPage';

const appConfig = require('../config/template').app;

class Guide extends Component {
  state = {
    enableGuide: false,
  };
  componentWillMount() {
    const { tintColor } = this.context.properties;
    this.theme = {
      color: '#fff',
      backgroundColor: tintColor,
    };
    const hideGuide = Boolean(localStorage.getItem('hideGuide'));
    const enableGuide = appConfig.enableGuide;
    this.setState({
      enableGuide: enableGuide && !hideGuide,
    });
  }

  onStart = () => {
    this.setState({
      enableGuide: false,
    });
    localStorage.setItem('hideGuide', 1);
  }
  render() {
    const { enableGuide } = this.state;
    return (
      <div>
        <NavBar
          theme={this.theme}
          isTransparent
        />
        <MenuPage>
          <GuideCarousel
            key="1"
            onStart={this.onStart}
            hide={!enableGuide}
          />
          {
            enableGuide ? null : <LoginGuide key="2" />
          }
        </MenuPage>
      </div>
    );
  }
}

Guide.propTypes = {
};

Guide.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
  };
}


export default connect(mapStateToProps)(Guide);
