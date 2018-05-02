import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';

const styles = {
  container: {
    overflow: 'hidden',
    width: '100%',
    height: '1.8rem',
    backgroundColor: '#fff',
    borderBottom: '0.02rem solid rgba(0,0,0,0.04)',
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
    lineHeight: '1.8rem',
    width: '2rem',
    paddingLeft: '0.2rem',
  },
  arrowBox: {
    float: 'right',
    lineHeight: '1.78rem',
    paddingRight: '0.4rem',
    color: '#909090',
    fontSize: '0.5rem',
  }
};

class SortItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchState: true,
    }
  }


  render() {
    const { iconImg, deviceName } = this.props;
    const { switchState } = this.state;
    return (
      <div style={styles.container}>
        <div style={styles.iconBox}>
          <img style={styles.deviceIcon} src={iconImg} />
        </div>
        <div style={styles.titleBox}>
          {deviceName}
        </div>
        <div style={styles.arrowBox}>
          <span className="mdi mdi-chevron-right"></span>
        </div>
      </div>
    );
  }
}
SortItem.propTypes = {

};

export default SortItem;
