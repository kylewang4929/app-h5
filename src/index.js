import dva from 'dva';
import 'intl';

import './index.html';
import './index.less';

import { getPlatform } from './utils/browser';

import flex from './utils/antm-viewport';

if (getPlatform() === 'iOS') {
  // flex(100, 1);
}
// 引入 ant的css
require('antd-mobile/dist/antd-mobile.min.css');

require('github-markdown-css/github-markdown.css');

// 图标
require('mdi/css/materialdesignicons.css');
require('./iphoneX.css');

const FastClick = require('fastclick');

FastClick.attach(document.body);

/**
 * 调试
 */
// localStorage.setItem('uid', '3152f20c74094da78ad5a59dd1143831');
// localStorage.setItem('token', '63469cdf4fd643a897cd951129f78a4e');
/**
 * 调试
 */

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/navState'));
app.model(require('./models/loginState'));
app.model(require('./models/gizwitsSdk'));
app.model(require('./models/tabState'));
app.model(require('./models/deviceList'));
app.model(require('./models/productList'));
app.model(require('./models/configWifi'));
app.model(require('./models/deviceData'));
app.model(require('./models/userState'));
app.model(require('./models/serverState'));
app.model(require('./models/scheduler'));
app.model(require('./models/language'));
app.model(require('./models/shareState'));
app.model(require('./models/deviceGroup'));
app.model(require('./models/templateState'));
app.model(require('./models/scenario'));
app.model(require('./models/appInfo'));
app.model(require('./models/groupScheduler'));
app.model(require('./models/aggregateData'));
app.model(require('./models/timing'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
