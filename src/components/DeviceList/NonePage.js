import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import NonePage from '../NoneAnimate';

class None extends Component {
  render() {
    return <NonePage buttonText={<FormattedMessage id="ADD_DEVICE" />} {...this.props} />;
  }
}

export default None;
