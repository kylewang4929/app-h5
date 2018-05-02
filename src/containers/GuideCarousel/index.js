import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim';
import { Button, Carousel } from 'antd-mobile';
import Swiper from 'swiper';
import { FormattedMessage } from 'react-intl';
import { getPlatform } from '../../utils/browser';

require('swiper/dist/css/swiper.min.css');
require('./styles.less');

const styles = {
  contianer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: '0px',
    top: '0px',
    zIndex: 999,
    transition: 'transform 0.375s ease-in-out 0s',
  },
  buttonBox: {
    position: 'absolute',
    textAlign: 'center',
    bottom: '1rem',
    width: '100%',
  },
  button: {
    boxShadow: '0px 2px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 10px 0px rgba(0, 0, 0, 0.08)',
    padding: '0 0.2rem',
    margin: 'auto',
    width: '3.4rem',
    border: '0.02rem solid #fff',
    color: '#fff',
  },
  item: {
    height: '100%',
    backgroundColor: '#000',
    textAlign: 'center',
    fontSize: '4rem',
    color: '#909090',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
  },
  text: {
    fontSize: '0.34rem',
    display: 'block',
    marginTop: '0.6rem',
  },
  out: {
    transform: 'translateX(-100%)',
  },
  icon: {
    display: 'inline-block',
    fontSize: '0.5rem',
    webkitTextStroke: '0.01rem #fff',
    marginLeft: '-0.34rem',
    opacity: 0.6,
  },
  nextIcon: {
    position: 'absolute',
    right: '0rem',
    fontSize: '0.5rem',
    marginTop: '-0.7rem',
    top: '50%',
  },
};

const rightAnimateConfig = {
  duration: 1400,
  delay: 200,
  type: ['right', 'left'],
};

const guide1 = require('../../assets/guide1.jpg');
const guide2 = require('../../assets/guide2.jpg');
const guide3 = require('../../assets/guide3.jpg');

const dpr = typeof window !== 'undefined' && window.devicePixelRatio || 2;

function getSwiperX() {
  let x = -50;
  if (getPlatform() === 'iOS') {
    x *= dpr;
  }
  return x;
}

class GuideCarousel extends Component {

  state = {
    index: 0,
    state: '',
  };

  componentDidMount() {
    this.mySwiper = new Swiper(this.dom, {
      pagination : '.swiper-pagination',
      onSetTranslate: (swiper, translate) => {
        const { onStart } = this.props;
        const weight = swiper.width;
        if (swiper.activeIndex === 2 && weight * (3 - 1) + translate < getSwiperX()) {
          onStart();
          this.setState({
            state: 'out',
          });
        }
      },
      onSlideChangeEnd: (swiper) => {
        this.setState({
          index: swiper.activeIndex,
        });
      },
    });
  }

  afterChange = (index) => {
    this.setState({
      index,
    });
    // 写localstroage 把阅读的标记为设置为已读
    localStorage.setItem('showGuide', true);
  }
  render() {
    const { index, state } = this.state;
    const { onStart, hide } = this.props;
    const { properties } = this.context;
    const { tintColor } = properties;
    return (
      // <div style={{ ...styles.contianer, ...hide ? styles.out : {} }} ref={(e) => { this.dom = e; }} className="swiper-container">
      //   <div className="swiper-wrapper">
      //     <div className="swiper-slide" style={{ ...styles.item, backgroundImage: `url(${guide1})` }} />
      //     <div className="swiper-slide" style={{ ...styles.item, backgroundImage: `url(${guide2})` }} />
      //     <div className="swiper-slide" style={{ ...styles.item, backgroundImage: `url(${guide3})` }}>
      //       <div key="1" style={styles.buttonBox}>
      //         <Button style={styles.button} onClick={onStart} type="primary">
      //           <FormattedMessage id="GUIDE_START_BUTTON" />
      //         </Button>
      //       </div>
      //       <div style={{ ...styles.nextIcon, color: tintColor }} className="guide-animate">
      //         <span style={styles.icon} className="mdi mdi-chevron-left" />
      //         <span style={styles.icon} className="mdi mdi-chevron-left" />
      //         <span style={styles.icon} className="mdi mdi-chevron-left" />
      //       </div>
      //     </div>
      //   </div>
      //   <div className="swiper-pagination" />
      // </div>
      <Carousel
        style={{ ...styles.contianer, ...hide ? styles.out : {} }}
        className="my-carousel"
        selectedIndex={0}
        swipeSpeed={35}
      >
        <div style={{ ...styles.item, backgroundImage: `url(${guide1})` }} />
        <div style={{ ...styles.item, backgroundImage: `url(${guide2})` }} />
        <div style={{ ...styles.item, backgroundImage: `url(${guide3})` }}>
          <div key="1" style={styles.buttonBox}>
            <Button style={styles.button} onClick={onStart} type="primary">
              <FormattedMessage id="GUIDE_START_BUTTON" />
            </Button>
          </div>
        </div>
      </Carousel>
    );
  }
}

GuideCarousel.propTypes = {
};

GuideCarousel.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    language: state.language,
  };
}


export default connect(mapStateToProps)(GuideCarousel);
