import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Switch } from 'antd-mobile';

const allOnImg  = require('../../assets/all_on.png');
const allOffImg  = require('../../assets/all_off.png');

const styles = {
  container: {
		overflow: 'hidden',
		width: '100%',
		height: '1.8rem',
		backgroundColor: '#fff',
  },
  iconBox: {
    float: 'left',
    position: 'relative',
    height: '1.8rem',
    width: '1.8rem',
  },
  deviceIcon: {
    position: 'absolute',
    height: '1.2rem',
    width: '1.2rem',
    left: '50%',
    top: '50%',
    marginTop: '-0.6rem',
    marginLeft: '-0.6rem',
  },
  titleBox: {
    float: 'left',
    height: '1.8rem',
    width: '2rem',
    paddingLeft: '0.2rem',
  },
  title: {
    fontSize: '0.32rem',
    color: '#121212',
    height: '0.5rem',
    margin: '0',
    padding: '0',
    paddingTop: '0.45rem',
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: '0.28rem',
    color: '#909090',
    height: '0.75rem',
    margin: '0',
    padding: '0',
  },
  switchBox: {
    float: 'right',
    height: '1.8rem',
    width: '36%',
    position: 'relative',
    color: '#FD1D1D',
    fontSize: '0.32rem',
    textAlign: 'right',
    lineHeight: '1.78rem',
    paddingRight: '0.4rem',
    boxSizing: 'border-box',
  },
  allOffSwitch: {
    textAlign: 'center',
    position: 'absolute',
    left: '0',
    top: '50%',
    marginTop: '-0.63rem',
    width: '1.1rem',
    height: '1.26rem',
    color: '#FF8484',
    fontSize: '0.25rem',
    lineHeight: '0.26rem',
  },
  allOnSwitch: {
    textAlign: 'center',
    position: 'absolute',
    right: '0.15rem',
    top: '50%',
    marginTop: '-0.63rem',
    width: '1.1rem',
    height: '1.26rem',
    color: '#00C3FF',
    fontSize: '0.25rem',
    lineHeight: '0.26rem',
  },
  switchImg: {
    margin: '0.1rem auto',
    width: '0.8rem',
    display: 'block',
  }
};

class GroupHead extends Component {
  constructor(props){
    super(props);
    this.state = {
      // switchState: true, 
    }

    this.switchOnClick = this.switchOnClick.bind(this);
  }

  switchOnClick(value) {
    const { onSwitchChange } = this.props;
    onSwitchChange(value);
  }

  render() {
    const { iconImg, groupName, productName,isOffLine } = this.props;
    // const { switchState } = this.state;
    return (
      <div style={styles.container}>
        <div style={styles.iconBox}>
          <img style={styles.deviceIcon} src={iconImg} />
        </div>
        <div style={styles.titleBox}>
          <p style={{...styles.title,...(isOffLine ? {color: '#909090'} : {color: '#121212'})}}>
            {groupName}
          </p>
          <p style={styles.subTitle}>
            {productName}
          </p>
        </div>
        <div style={styles.switchBox}>
          {/* {isOffLine ? "已离线" : <Switch platform="android" checked={switchState} onClick={this.switchOnClick} />} */}
          {
            isOffLine ?
            <FormattedMessage id="ALL_OFFLINE" />
            :
            <div>
              <div style={styles.allOffSwitch} onClick={this.switchOnClick.bind(null,'off')}>
                <img style={styles.switchImg} src={allOffImg} alt=""/>
                {/* <span>全部关闭</span> */}
                <FormattedMessage id="ALL_OFF" />
              </div>
              <div style={styles.allOnSwitch} onClick={this.switchOnClick.bind(null,'on')}>
                <img style={styles.switchImg} src={allOnImg} alt=""/>
                {/* <span>全部开启</span> */}
                <FormattedMessage id="ALL_ON" />
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}
GroupHead.propTypes = {
  
};

export default GroupHead;
