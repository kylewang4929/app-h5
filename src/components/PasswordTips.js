import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

const styles = {
  container: {
    fontSize: '0.26rem',
    color: '#ff6464',
    textAlign: 'left',
    paddingTop: '0.2rem',
  },
};

class PasswordTips extends Component {
  render() {
    return (
      <div style={styles.container}>
        <FormattedMessage id={'PASSWORD_TIPS'} />
      </div>
    );
  }
}

PasswordTips.defaultProps = {
};
PasswordTips.propTypes = {
};

export default PasswordTips;
