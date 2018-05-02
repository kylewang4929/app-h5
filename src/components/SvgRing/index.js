import React, { Component } from 'react';

require('./index.less');

class SvgRing extends Component {
  state = {

  }
  render() {
    const { present, style, centerText, innerRadius, outerRadius } = this.props;
    const radius = (innerRadius + outerRadius) * 2;
    const tol = (970 / 400) * radius;
    return (
      <div className="ring_contain" style={{ height: radius, width: radius }}>
        <svg width={radius} height={radius} viewBox={`0 0 ${radius} ${radius}`}>
          <circle cx={radius / 2} cy={radius / 2} r={innerRadius} strokeWidth={outerRadius} stroke="#dbdbdb" fill="none" />
          <circle cx={radius / 2} cy={radius / 2} r={innerRadius} strokeWidth={outerRadius} stroke="#59c8ba" fill="none" transform={`matrix(0,-1,1,0,0,${radius})`} strokeDasharray={`${tol * present} ${tol}`} />
        </svg>
        {
            centerText ? (
              <div className="ring_center">
                <div>{centerText}</div>
                <p>{present * 100}<sub>%</sub></p>
              </div>
            ) : null
        }

      </div>
    );
  }
}

export default SvgRing;
