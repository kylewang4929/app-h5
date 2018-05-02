import React, { Component, PropTypes } from 'react';
import { getPlatform } from '../../utils/browser';

require('./styles.less');

const styles = {
  container: {
    textAlign: 'center',
    padding: '0.8rem 0 0.6rem 0',
    position: 'relative',
  },
  text: {
    fontSize: '0.45rem',
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    top: '50%',
    marginTop: '-0.18rem',
    paddingLeft: '0.04rem',
    color: '#909090',
  },
  circleColor: {
    transition: 'all 0.375s cubic-bezier(0.4, 0.0, 0.2, 1)',
    webKitTransition: 'all 0.375s cubic-bezier(0.4, 0.0, 0.2, 1)',
  },
};

const dpr = typeof window !== 'undefined' && window.devicePixelRatio || 2;

class Loader extends Component {

  constructor(props) {
    super(props);
    this.svgStrokeLength = 380;
    if (getPlatform() === 'iOS') {
      this.width = 120 * dpr;
    } else {
      this.width = 120;
    }
  }

  render() {
    const { progress } = this.props;
    const strokeDashoffset = this.svgStrokeLength - ((this.svgStrokeLength * progress) / 100);
    return (
      <div style={styles.container} className="my-loader">
        <div style={styles.text}>{progress}%</div>
        <svg xmlns="http://www.w3.org/2000/svg" width={this.width} height={this.width} viewBox="0 0 124 124">
          <circle id="circle" className="circle-bg" cx="62" cy="62" r="59" />
          <circle
            id="circle"
            ref={(e) => { this.circleColor = e; }}
            className="circle-color"
            cx="62"
            cy="62"
            r="59"
            style={{ strokeDashoffset, ...styles.circleColor }}
            transform="rotate(-90 62 62)"
          />
        </svg>
      </div>
    );
  }
}

Loader.propTypes = {
  progress: PropTypes.number,
};

export default Loader;
