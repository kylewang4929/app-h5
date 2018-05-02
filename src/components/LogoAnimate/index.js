import React, { Component } from 'react';
import TweenOne from 'rc-tween-one';
import ticker from 'rc-tween-one/lib/ticker';
import ReactDOM from 'react-dom';

require('./styles.less');

const dpr = typeof window !== 'undefined' && window.devicePixelRatio || 2;

class LogoAnimate extends Component {

  static propTypes = {
    image: React.PropTypes.string,
    w: React.PropTypes.number,
    h: React.PropTypes.number,
    pixSize: React.PropTypes.number,
    pointSizeMin: React.PropTypes.number,
  };

  static defaultProps = {
    image: 'https://zos.alipayobjects.com/rmsportal/gsRUrUdxeGNDVfO.svg',
    className: 'logo-gather-demo',
    w: 200 * dpr,
    h: 200 * dpr,
    pixSize: 11.5 * dpr,
    pointSizeMin: 7 * dpr,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.interval = null;
    this.gather = true;
    this.intervalTime = 6000;
    this.startTimeout = null;
    this.endTimeout = null;
  }

  componentDidMount() {
    this.dom = ReactDOM.findDOMNode(this);
    this.createPointData();
  }

  componentWillUnmount() {
    ticker.clear(this.interval);
    if (this.interval) {
      clearTimeout(this.interval);
    }
    if (this.startTimeout) {
      clearTimeout(this.startTimeout);
    }
    if (this.endTimeout) {
      clearTimeout(this.endTimeout);
    }
  }

  setDataToDom(data, w, h) {
    this.pointArray = [];
    const number = this.props.pixSize;
    for (let i = 0; i < w; i += number) {
      for (let j = 0; j < h; j += number) {
        if (data[((i + j * w) * 4) + 3] > 150) {
          this.pointArray.push({ x: i, y: j });
        }
      }
    }
    const children = [];
    this.pointArray.forEach((item, i) => {
      const r = Math.random() * this.props.pointSizeMin + this.props.pointSizeMin;
      const b = Math.random() * 0.4 + 0.1;
      children.push(
        <TweenOne className="point-wrapper" key={i} style={{ left: item.x, top: item.y }}>
          <TweenOne
            className="point"
            style={{
              width: r,
              height: r,
              opacity: b,
              backgroundColor: `rgb(${Math.round(Math.random() * 95 + 160)},255,255)`,
            }}
            animation={{
              y: (Math.random() * 2 - 1) * 10 || 5,
              x: (Math.random() * 2 - 1) * 5 || 2.5,
              delay: Math.random() * 1000,
              repeat: -1,
              duration: 3000,
              yoyo: true,
              ease: 'easeInOutQuad',
            }}
          />
        </TweenOne>
      );
    });
    this.setState({
      children,
      boxAnim: { opacity: 0, type: 'from', duration: 800 },
    }, () => {
      // this.interval = ticker.interval(this.updateTweenData, this.intervalTime);
    });
  }

  createPointData = () => {
    const { w, h } = this.props;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    canvas.width = this.props.w;
    canvas.height = h;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      this.setDataToDom(data, w, h);
      this.dom.removeChild(canvas);

      this.startTimeout = setTimeout(() => {
        this.onMouseLeave();
      });
      this.endTimeout = setTimeout(() => {
        this.onMouseEnter();
      }, 500);

    };
    img.crossOrigin = 'anonymous';
    img.src = this.props.image;
  };

  gatherData = () => {
    const children = this.state.children.map(item =>
      React.cloneElement(item, {
        animation: {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          delay: Math.random() * 500,
          duration: 800,
          ease: 'easeInOutQuint',
        },
      })
    );
    this.setState({ children });
  };

  onMouseEnter = () => {
    // !this.gather && this.updateTweenData();
    if (!this.gather) {
      this.updateTweenData();
    }
    this.componentWillUnmount();
  };

  onMouseLeave = () => {
    // this.gather && this.updateTweenData();
    if (this.gather) {
      this.updateTweenData();
    }
    // this.interval = ticker.interval(this.updateTweenData, this.intervalTime);
  };

  disperseData = () => {
    const rect = this.dom.getBoundingClientRect();
    const sideRect = this.sideBox.getBoundingClientRect();
    const sideTop = sideRect.top - rect.top;
    const sideLeft = sideRect.left - rect.left;
    const children = this.state.children.map(item =>
      React.cloneElement(item, {
        animation: {
          x: Math.random() * rect.width - sideLeft - item.props.style.left,
          y: Math.random() * rect.height - sideTop - item.props.style.top,
          opacity: Math.random() * 0.4 + 0.1,
          scale: Math.random() * 2.4 + 0.1,
          duration: Math.random() * 500 + 500,
          ease: 'easeInOutQuint',
        },
      })
    );

    this.setState({
      children,
    });
  };

  updateTweenData = () => {
    this.dom = ReactDOM.findDOMNode(this);
    this.sideBox = ReactDOM.findDOMNode(this.sideBoxComp);
    ((this.gather && this.disperseData) || this.gatherData)();
    this.gather = !this.gather;
  };

  render() {
    return (<div className="logo-gather-demo-wrapper">
      <canvas id="canvas" />
      <TweenOne
        animation={this.state.boxAnim}
        className="right-side blur"
        ref={(c) => {
          this.sideBoxComp = c;
        }}
      >
        {this.state.children}
      </TweenOne>
    </div>);
  }
}

export default LogoAnimate;
