import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import router from '../../utils/router';
import CommonButton from './CommonButton';

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

class EditGroupButton extends Component {
  onClick = () => {
    const { gid,dispatch } = this.props;
    const deviceList = this.props.deviceGroup.data;
    dispatch({
      type: 'deviceGroup/updateTemp',
      payload: deviceList,
    })
    router.go(`#/menu/editDeviceGroup/${gid}`);
  }
  render() {
    // 覆盖主题颜色
    const { topNavColor } = this.context.properties;
    let { color } = this.props;
    color = color || topNavColor;
    return (
      <CommonButton onClick={this.onClick}>
        <span className="mdi mdi-pencil-box-outline" style={styles.icon} />
      </CommonButton>
    );
  }
}

EditGroupButton.propTypes = {
  color: PropTypes.string,
};

EditGroupButton.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    deviceGroup: state.deviceGroup,
  };
}


export default connect(mapStateToProps)(EditGroupButton);
