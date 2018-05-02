import React, { Component, PropTypes } from 'react';

const styles = {
  nonePage: {
    textAlign: 'center',
    color: '#909090',
    padding: '1rem 0',
  },
  noneIcon: {
    fontSize: '2rem',
  },
  noneText: {
    fontSize: '0.28rem',
    lineHeight: '0.4rem',
  },
};
class NonePage extends Component {
  render() {
    const { icon, text } = this.props;
    return (
      <div style={styles.nonePage}>
        <span style={styles.noneIcon} className={`mdi mdi-${icon}`} />
        <div style={styles.noneText}>{text}</div>
      </div>
    );
  }
}

export default NonePage;
