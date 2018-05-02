import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'react-intl';

import CommonButton from './CommonButton';

const styles = {
  icon: {
    height: '0.5rem',
    width: '0.8rem',
    fontSize: '0.28rem',
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: '-0.6rem',
    marginTop: '-0.25rem',
    textAlign: 'center',
    lineHeight: '0.5rem',
    backgroundColor: '#00C3FF',
    borderRadius: '0.1rem',
    color: '#fff',
  },
  iconBox: {
    position: 'relative',
    height: '0.9rem',
    width: '0.9rem',
  },
  rightIcon: {
  },
  leftIcon: {
  },
};

class SaveGroupButton extends Component {
  onClick = () => {
    const { onClick } = this.props;
    onClick();
  }
  render() {
    // 覆盖主题颜色
    const { topNavColor } = this.context.properties;
    let { color } = this.props;
    color = color || topNavColor;
    return (
      <CommonButton onClick={this.onClick}>
        {/* <FormattedMessage id="SAVE" /> */}
        <span className="mdi mdi-content-save" />
      </CommonButton>
    );
  }
}

SaveGroupButton.propTypes = {
  color: PropTypes.string,
};

SaveGroupButton.contextTypes = {
  properties: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
  };
}


export default connect(mapStateToProps)(SaveGroupButton);
