import React, { PropTypes, Component } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';

import NavBar from '../../containers/NavBar';
import MenuPage from '../../components/MenuPage';
import Scroll from '../../components/Scroll';

import BackButton from '../../containers/MenuButton/BackButton';
import router from '../../utils/router';

import config from '../../config/template';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    boxSizing: 'border-box',
    padding: '0.3rem 0.3rem',
  },
  brandBox: {
    position: 'relative',
    display: 'inline-block',
    boxSizing: 'border-box',
    width: '100%',
    height: '5rem',
    backgroundColor: '#fff',
    borderRadius: '0.1rem',
    marginBottom: '0.14rem',
  },
  brandImg: {
    position: 'absolute',
    width: '5rem',
    top: '20%',
    left: '50%',
    marginLeft: '-2.5rem',
  },
  go: {
    position: 'absolute',
    width: '3rem',
    height: '0.5rem',
    display: 'block',
    top: '70%',
    left: '50%',
    marginLeft: '-1.5rem',
    fontWeight: 'bold',
    fontSize: '0.4rem',
  },
  arrow: {
    display: 'inline-block',
    width: '0.4rem',
    height: '0.4rem',
    fontSize: '0.7rem',
    lineHeight: '0.3rem',
    verticalAlign: 'middle',
    position: 'relative',
    left: '-0.1rem',
  }
}

const echoImg = require('../../assets/amazon_echo.png');
const googleImg = require('../../assets/google_home.png');

class EchoTips extends Component {

  state = {
    voiceTips: {},
  };

  componentWillMount() {
    let { voiceTips } = config;
    if (!voiceTips) {
      voiceTips = {};
    }
    this.setState({
      voiceTips,
    });
  }

  goEcho() {
    router.go('#/menu/echo');
  }

  goGoogle() {
    router.go('#/menu/googleHome');
  }

  render() {
    const { voiceTips } = this.state;

    return (
      <div>
        <NavBar
          title="USE_ECHO"
          leftButton={<BackButton />}
        />
        <MenuPage>
          <Scroll bounce>
            <div style={styles.container}>
              {
                voiceTips.echo ? (
                  <div style={styles.brandBox} className="z-depth-1" onClick={this.goEcho}>
                    <img style={styles.brandImg} src={echoImg} alt=""/>
                    <span style={styles.go}><FormattedMessage id="HOW_TO_USE" /><i className="mdi mdi-chevron-right" style={styles.arrow}></i></span>
                  </div>
                ) : null
              }
              {
                voiceTips.googleHome ? (
                  <div style={styles.brandBox} className="z-depth-1" onClick={this.goGoogle}>
                    <img style={styles.brandImg} src={googleImg} alt=""/>
                    <span style={styles.go}><FormattedMessage id="HOW_TO_USE" /><i className="mdi mdi-chevron-right" style={styles.arrow}></i></span>
                  </div>
                ) : null
              }
            </div>
          </Scroll>
        </MenuPage>
      </div>
    );
  }
}

EchoTips.propTypes = {
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(EchoTips);
