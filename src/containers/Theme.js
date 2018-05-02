
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import properties from '../config/template';

/**
 * 传递config给子组件
 */
class Theme extends Component {
  getChildContext() {
    return {
      properties: properties.app.color,
    };
  }
  render() {
    const { children } = this.props;
    return (
      <div>
        {children}
      </div>
    );
  }
}

Theme.childContextTypes = {
  properties: PropTypes.object,
};

Theme.propTypes = {
  children: PropTypes.element,
};

function mapStateToProps() {
  return {
  };
}


export default connect(mapStateToProps)(Theme);
