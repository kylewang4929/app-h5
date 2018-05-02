import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd-mobile';

require('./styles.less');

const bgImage = require('./bg.png');

const styles = {
  containerBox: {
    padding: '1rem 0',
  },
  container: {
    padding: '0.4rem 0 1rem 0',
    margin: '0.2rem auto 0.6rem auto',
    width: '5.4rem',
    position: 'relative',
    backgroundImage: `url(${bgImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
  },
  inner: {
    marginLeft: '0.7rem',
  },
  title: {
    color: '#444444',
    textAlign: 'center',
  },
  button: {
    width: '80%',
    margin: 'auto',
  },
};

class NoneAnimate extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.dom.setAttribute('class', 'device-none-animate active');
    });
  }
  render() {
    const { onClick, buttonText } = this.props;
    return (
      <div style={styles.containerBox} className="device-none-animate" ref={e => this.dom = e}>
        <div style={styles.title}>
          <FormattedMessage id="LET_THE_WISDOM_CONNECT_LIFE" />
        </div>
        <div style={styles.container} className="bg-animate">
          <div style={styles.inner}>
            <Triangle />
            <Phone />
          </div>
        </div>
        <Button style={styles.button} onClick={onClick} type="primary">
          {buttonText}
        </Button>
      </div>
    );
  }
}

const triangleImage = require('./triangle.png');

const triangleStyles = {
  container: {
    width: '3.4rem',
    height: '3.4rem',
    position: 'relative',
    margin: 'auto',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
};

class Triangle extends Component {
  render() {
    return (
      <div className={`triangle`} style={triangleStyles.container}>
        <img src={triangleImage} style={{ ...triangleStyles.icon }} />
      </div>
    );
  }
}

const phoneStyles = {
  container: {
    backgroundColor: '#cee4f3',
    height: '2.4rem',
    width: '1.4rem',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: '-0.6rem',
    marginTop: '-1.2rem',
    borderRadius: '0.1rem',
    border: '0.02rem solid #385392',
    padding: '0.04rem 0.04rem 0.32rem 0.04rem',
    boxSizing: 'border-box',
  },
  inner: {
    backgroundColor: '#fff',
    height: '100%',
    borderTopLeftRadius: '0.1rem',
    borderTopRightRadius: '0.1rem',
  },
  home: {
    width: '0.18rem',
    height: '0.18rem',
    borderRadius: '50%',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: '0.06rem',
    left: '50%',
    marginLeft: '-0.09rem',
  },
  line1: {
    position: 'absolute',
    top: '0rem',
    left: '50%',
    marginLeft: '-0.43rem',
  },
  line2: {
    position: 'absolute',
    bottom: '0.6rem',
    left: '50%',
    marginLeft: '-0.43rem',
  },
  shotLine: {
    width: '0.2rem',
    height: '0.04rem',
    margin: '0.01rem 0.04rem',
    display: 'inline-block',
    borderRadius: '0.1rem',
    backgroundColor: '#e2eff8',
  },
  lineItem: {
    height: '0.12rem',
    margin: '0.04rem 0',
  },
  longLine: {
    width: '0.5rem',
    height: '0.04rem',
    margin: '0.01rem 0.04rem',
    display: 'inline-block',
    borderRadius: '0.1rem',
    backgroundColor: '#e2eff8',
  },
};
class Phone extends Component {
  render() {
    return (
      <div className="phone" style={phoneStyles.container}>
        <div style={phoneStyles.inner}></div>
        <div style={phoneStyles.home}></div>
        <Wifi />
        <div style={phoneStyles.line1}>
          <div className="line1" style={phoneStyles.lineItem}>
            <div style={{ ...phoneStyles.shotLine, backgroundColor: '#ecb4b5' }} />
            <div style={phoneStyles.longLine} />
          </div>
          <div className="line2" style={phoneStyles.lineItem}>
            <div style={phoneStyles.longLine} />
            <div style={phoneStyles.shotLine} />
          </div>
        </div>
        <div style={phoneStyles.line2}>
          <div style={phoneStyles.lineItem}>
            <div className="line1" style={phoneStyles.shotLine} />
            <div style={phoneStyles.longLine} />
          </div>
          <div className="line2" style={phoneStyles.lineItem}>
            <div style={phoneStyles.longLine} />
            <div style={phoneStyles.shotLine} />
          </div>
        </div>
      </div>
    );
  }
}

const wifiStyles = {
  container: {
    width: '0.64rem',
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: '-0.32rem',
    marginTop: '-0.35rem',
  },
  icon: {
    width: '100%',
    display: 'block',
  },
};

const wifi1 = require('./wifi1.png');
const wifi2 = require('./wifi2.png');
const wifi3 = require('./wifi3.png');

class Wifi extends Component {
  render() {
    return (
      <div className="wifi" style={wifiStyles.container}>
        <img className="wifi1" src={wifi1} style={{ ...wifiStyles.icon, marginBottom: '-0.05rem' }} />
        <img className="wifi2" src={wifi2} style={{ ...wifiStyles.icon, marginBottom: '-0.02rem' }} />
        <img className="wifi3" src={wifi3} style={wifiStyles.icon} />
      </div>
    );
  }
}

NoneAnimate.propTypes = {
};

export default NoneAnimate;
