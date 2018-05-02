import React, { Component, PropTypes } from 'react';

const styles = {
  container: {
    padding: '0.1rem 0.2rem',
  },
  point: {
    width: '0.18rem',
    height: '0.18rem',
    border: '0.02rem solid #909090',
    padding: '0.04rem',
    display: 'inline-block',
    borderRadius: '50%',
    position: 'relative',
    top: '0.05rem',
  },
  pointInner: {
    width: '100%',
    height: '100%',
    display: 'block',
    borderRadius: '50%',
    backgroundColor: '#909090',
  },
  text: {
    paddingLeft: '0.1rem',
    fontSize: '0.28rem',
    color: '#909090',
  },
};

class Radio extends Component {
  onClick = () => {
    const { value, onChange } = this.props;
    onChange(!value);
  }
  render() {
    const color = '#909090';
    const { tintColor } = this.context.properties;
    const selected = this.props.value;
    const { tips } = this.props;
    return (
      <div style={styles.container} onClick={this.onClick}>
        <div style={{ ...styles.point, borderColor: selected ? tintColor : color }}>
          <div style={{ ...styles.pointInner, backgroundColor: selected ? tintColor : 'rgba(0,0,0,0)' }} />
        </div>
        <span style={styles.text}>{tips}</span>
      </div>
    );
  }
}

Radio.defaultProps = {
};
Radio.propTypes = {
};
Radio.contextTypes = {
  properties: PropTypes.object.isRequired,
};

export default Radio;
