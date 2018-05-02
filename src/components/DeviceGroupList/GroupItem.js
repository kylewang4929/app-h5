import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';

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
  arrowBox: {
    float: 'right',
    lineHeight: '1.7rem',
    paddingRight: '0.4rem',
    color: '#909090',
    fontSize: '0.5rem',
  },
  offlineTips: {
    fontSize: '0.28rem',
    color: '#FD1D1D',
    position: 'relative',
    top: '-0.06rem',
  },
  arrow: {
    verticalAlign: 'middle',
  }
};

class GroupHead extends Component {
  constructor(props){
    super(props);
    this.state = {
      switchState: true, 
    }

    this.switchOnClick = this.switchOnClick.bind(this);
  }

  switchOnClick(value) {
    let { switchState } = this.state;
    this.setState({
      switchState: !switchState, 
    })
  }

  switchOffline(id) {
    switch(id) {
      case 'all': {
        return
      }
      case 'some': {
        return <span style={styles.offlineTips}><FormattedMessage id="SOME_OFFLINE" /></span>
      }
      case 'none': {
        return <span style={styles.offlineTips}><FormattedMessage id="ALL_OFFLINE" /></span>
      }
    }
  }

  render() {
    const { iconImg, title, tips, isOffLine } = this.props;
    const { switchState } = this.state;
    return (
      <div style={styles.container}>
        <div style={styles.iconBox}>
          <img style={styles.deviceIcon} src={iconImg} />
        </div>
        <div style={styles.titleBox}>
          <p style={styles.title}>
            {title}
          </p>
          <p style={styles.subTitle}>
            {tips}
          </p>          
        </div>
        <div style={styles.arrowBox}>
          {this.switchOffline(isOffLine)}
          <span className="mdi mdi-chevron-right" style={styles.arrow}></span>
        </div>
      </div>
    );
  }
}
GroupHead.propTypes = {
  
};

export default GroupHead;
