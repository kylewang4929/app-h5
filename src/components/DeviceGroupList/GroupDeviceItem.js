import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Switch } from 'antd-mobile';

const styles = {
  container: {
		overflow: 'hidden',
		width: '100%',
		height: '1.5rem',
    backgroundColor: '#fff',
    position: 'relative',
  },
  leftBox: {
    float: 'left',
    width: '2rem',
    overflow: 'hidden',
    height: '1.5rem',
    lineHeight: '1.5rem',
    paddingLeft: '0.5rem',
    fontSize: '0.32rem',
    fontWeight: 'bold',
  },
  middleBox: {
    position: 'absolute',
    height: '1.5rem',
    width: '1.5rem',
    left: '46%',
    marginLeft: '-0.75rem',
    textAlign: 'center',
  },
  deviceStateTop: {
    margin: '0',
    height: '0.75rem',
    fontSize: '0.32rem',
    paddingTop: '0.38rem',
    boxSizing: 'border-box',
  },
  deviceStateBottom: {
    margin: '0',
    height: '0.75rem',
    fontSize: '0.32rem',
    paddingTop: '0.05rem',
  },
  rightBox: {
    float: 'right',
    overflow: 'hidden',
    height: '1.5rem',
    lineHeight: '1.5rem',
    paddingRight: '0.4rem',
    fontSize: '0.32rem',
    textAlign: 'center',
    color: '#FD1D1D',
  }
};

class GroupItem extends Component {
  constructor(props){
    super(props);
    this.state = {
      switchState: true, 
    }

    this.switchOnClick = this.switchOnClick.bind(this);
  }

  switchOnClick() {
    let { onSwitchChange } = this.props;
    onSwitchChange();
  }

  render() {
    const { switchState } = this.state;
    const { deviceName, deviceStateName, deviceState, isOffLine, power } = this.props;
    return (
      <div style={styles.container}>
        <div style={{...styles.leftBox,...(isOffLine ? {color: '#909090'} : {color: '#121212'})}}>
          {deviceName}
        </div>
        <div style={styles.middleBox}>
          <p style={styles.deviceStateTop}>{deviceStateName}</p>
          <p style={styles.deviceStateBottom}>{deviceState}</p>
        </div>
        <div style={styles.rightBox}>
          { isOffLine ? <FormattedMessage id="DEVICE_OFFLINE" /> : <Switch platform="android" checked={power} onClick={this.switchOnClick} /> }
        </div>
      </div>
    );
  }
}

GroupItem.defaultProps = {

}

GroupItem.propTypes = {
  deviceName: PropTypes.string,
  deviceStateName: PropTypes.string,
  deviceState: PropTypes.string,
  // onSwitchChange: PropTypes.func,
};

export default GroupItem;
