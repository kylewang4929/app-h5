import React, { Component } from 'react';
import { connect } from 'dva';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    padding: '0.5rem 0.2rem',
    boxSizing: 'border-box',
  },
  googleImg: {
    width: '100%',
  },
  step: {
    position: 'relative',
    display: 'inline-block',
    boxSizing: 'border-box',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '0.1rem',
    padding: '0.3rem 0',
    margin: '0.2rem 0',
  },
  title: {
    padding: '0 0.3rem',
    paddingBottom: '0.3rem',
    fontWeight: 'bold',
    fontSize: '0.3rem',
    lineHeight: '0.4rem',
  },
  text: {
    padding: '0 0.3rem',
    fontSize: '0.26rem',
    color: '#666',
    lineHeight: '0.4rem',
  },
};

const googleImg = require('../assets/google_home.png');

class GoogleHomeContent extends Component {
  getContent = (item) => {
    const { language } = this.props;
    return {
      text: item[`${language.key}_text`] || item.text,
      title: item[`${language.key}_title`] || item.title
    };
  }
  mapArr = (arr) => {
    let newArr = arr.map((item, index) => {
      const data = this.getContent(item);
      return (
        <div key={index} className="z-depth-1" style={styles.step}>
          <div style={styles.title}>{data.title}</div>
          {
            data.text.map((item, index) => {
              return (
                <div style={styles.text} key={index}>{item}</div>
              );
            })
          }
        </div>
      )
    });
    return(newArr);
  }

  render() {
    const { data } = this.props;
    return (
      <div style={styles.container}>
        <img src={googleImg} style={styles.googleImg} alt=""/>
        {this.mapArr(data)}
      </div>
    );
  }
}

GoogleHomeContent.propTypes = {
};

function mapStateToProps(state) {
  return {
    language: state.language,
  };
}

export default connect(mapStateToProps)(GoogleHomeContent);
