import React from 'react';
import { FormattedMessage } from 'react-intl';
import ListView from 'rmc-list-view';

import { getPlatform } from '../../utils/browser';

const dpr = typeof window !== 'undefined' && window.devicePixelRatio || 2;
ListView.RefreshControl.defaultProps = Object.assign({}, ListView.RefreshControl.defaultProps, {
  prefixCls: 'am-refresh-control',
  icon: [
    <div key="0" className="am-refresh-control-pull">
      <span><FormattedMessage id="THE_DROP_DOWN_CAN_REFRESH" /></span>
    </div>,
    <div key="1" className="am-refresh-control-release">
      <span><FormattedMessage id="LET_THE_FREE_HAND_REFRESH" /></span>
    </div>,
  ],
  loading: <span className="mdi mdi-loading list-icon-loading"></span>,
  refreshing: false,
  // distanceToRefresh: 50 / 2 * dpr,
  distanceToRefresh: getPlatform() === 'iOS' ? ((50 / 2) * dpr) : 28,
});

export default ListView.RefreshControl;
