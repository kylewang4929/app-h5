import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Button } from 'antd-mobile';
import router from '../../utils/router';

const styles = {
  icon: {
    fontSize: '0.44rem',
  },
  iconBox: {
    padding: '0rem 0.3rem',
  },
  rightIcon: {
  },
  leftIcon: {
  },
};

class AddGroupButton extends Component {
  onClick = () => {
    router.go('#/menu/selectSort');
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

AddGroupButton.propTypes = {
  color: PropTypes.string,
};

AddGroupButton.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
  };
}


export default connect(mapStateToProps)(AddGroupButton);
