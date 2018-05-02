import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Button } from 'antd-mobile';

import router from '../../utils/router';

const styles = {
  contianer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: '0px',
    top: '0px',
  },
  itemTitle: {
    fontSize: '0.3rem',
  },
  icon: {
    fontSize: '0.44rem',
  },
  listIcon: {
    width: '.7rem',
    height: '.7rem',
    margin: '0.1rem 0.5rem 0.1rem 0.3rem',
  },
  iconBox: {
    padding: '0rem 0.3rem',
  },
  rightIcon: {
  },
  leftIcon: {
  },
};

class AddTiming extends Component {
  onClick = () => {
    this.props.onClick();
  }
  render() {
    // 覆盖主题颜色
    const { topNavColor } = this.context.properties;
    let { color } = this.props;
    color = color || topNavColor;
    return (
      <Button className="outline" onClick={this.onClick} style={{ ...styles.iconBox, color, ...styles.rightIcon }}>
        <span className="mdi mdi-plus" style={styles.icon} />
      </Button>
    );
  }
}

AddTiming.propTypes = {
  color: PropTypes.string,
  onClick: PropTypes.func,
};

AddTiming.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
  };
}


export default connect(mapStateToProps)(AddTiming);
