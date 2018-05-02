import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { List } from 'antd-mobile';

const Item = List.Item;

const styles = {
  container: {
    position: 'relative',
    marginTop: '0.3rem',
  },
  item: {
    height: '1.6rem',
  },
  avatar: {
    // backgroundImage: `url(${avatarImage})`,
    width: '1.2rem',
    height: '1.2rem',
    borderRadius: '50%',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    position: 'absolute',
    left: '0.4rem',
    textAlign: 'center',
    lineHeight: '1.2rem',
    top: '50%',
    marginTop: '-0.6rem',
  },
  title: {
    fontSize: '0.28rem',
    fontWeight: '500',
  },
  subTitle: {
    fontSize: '0.26rem',
    color: '#909090',
  },
  icon: {
    color: '#909090',
    fontSize: '1rem',
  },
  infoBox: {
    color: '#3e3e3e',
    position: 'absolute',
    left: '1.9rem',
    top: '50%',
    marginTop: '-0.42rem',
  },
  rightIcon: {
    fontSize: '0.44rem',
    color: '#bfbfbf',
    top: '50%',
    position: 'absolute',
    right: '0.54rem',
    marginTop: '-0.3rem',
  },
};

class Avatar extends Component {

  static propTypes = {};

  render() {
    const { onClick, name, phone } = this.props;
    const { tintColor } = this.context.properties;
    return (
      <List style={styles.container}>
        <Item onClick={onClick} style={styles.item}>
          <div style={styles.avatar} >
            <span style={{ ...styles.icon, color: tintColor }} className="mdi mdi-account" />
          </div>
          <div style={styles.infoBox}>
            <div style={styles.title}>
              <FormattedMessage id={name || 'NOT_SET'} />
            </div>
            <div style={styles.subTitle}>
              <FormattedMessage id={phone || 'NOT_SET'} />
            </div>
          </div>
          <span className="mdi mdi-chevron-right" style={styles.rightIcon} />
        </Item>
      </List>
    );
  }
}

Avatar.contextTypes = {
  properties: PropTypes.object.isRequired,
};

Avatar.propTypes = {
  onClick: PropTypes.func,
  name: PropTypes.string,
  phone: PropTypes.string,
};

export default Avatar;
