import React from 'react';
import { Router, Route } from 'dva/router';
import App from './routes/App';
import Menu from './routes/Menu';
import DevicePage from './routes/DevicePage';
import SetTiming from './routes/SetTiming';

import AddTiming from './routes/AddTiming';
import Launch from './routes/Launch';
import Guide from './routes/Guide';
import MainPage from './routes/MainPage';
import AccountDetail from './routes/AccountDetail';
import Account from './routes/Account';
import Language from './routes/Language';
import SearchDevice from './routes/SearchDevice';
import InputWifiPassword from './routes/InputWifiPassword';
import ConfigWifi from './routes/ConfigWifi';

import EditNickName from './routes/EditNickName';
import EditAddress from './routes/EditAddress';
import Feedback from './routes/Feedback';
import Setting from './routes/Setting';
import Help from './routes/Help';
import HelpDetail from './routes/HelpDetail';
import AboutUs from './routes/AboutUs';
import Login from './routes/Login';
import Register from './routes/Register';
import SetPassword from './routes/SetPassword';
import SoftAp from './routes/SoftAp';
import AirLink from './routes/AirLink';
import ProfileSetting from './routes/ProfileSetting';
import ResetPassword from './routes/ResetPassword';
import DeviceMore from './routes/DeviceMore';

import VoiceTips from './routes/voiceTips/VoiceTips';
import Echo from './routes/voiceTips/Echo';
import GoogleHome from './routes/voiceTips/GoogleHome';

import Timing from './routes/Timing/Timing';
import TimingList from './routes/Timing/TimingListPage';
import TimingDetail from './routes/Timing/TimingDetail';

import GroupTiming from './routes/GroupTiming/Timing';
import GroupTimingList from './routes/GroupTiming/TimingListPage';
import GroupTimingDetail from './routes/GroupTiming/GroupTimingDetail';
import SubTimingDetail from './routes/GroupTiming/SubTimingDetail';

import DeviceSharing from './routes/deviceSharing/DeviceSharing';
import StartShareDevice from './routes/deviceSharing/StartShareDevice';
import ForgotPassword from './routes/ForgotPassword';
import ToShareUserDeviceList from './routes/deviceSharing/ToShareUserDeviceList';
import ShareSingleDevice from './routes/deviceSharing/ShareSingleDevice';
import AddDeviceGroup from './routes/deviceGroup/AddDeviceGroup';
import ToReceiveUserDeviceList from './routes/deviceSharing/ToReceiveUserDeviceList';
import ScenarioDetail from './routes/scenario/ScenarioDetail';
import ScenarioFeatures from './routes/scenario/ScenarioFeatures';
import ScenarioFeaturesDetail from './routes/scenario/ScenarioFeaturesDetail';

import ConfigTipsPage from './routes/ConfigTipsPage';

import ScenarioDeviceList from './routes/scenario/DeviceList';

// 分组页面
import DeviceGroupControl from './routes/deviceGroup/DeviceGroupControl';
import EditDeviceGroup from './routes/deviceGroup/EditDeviceGroup';
import AddDevice from './routes/deviceGroup/AddDevice';
import SelectSort from './routes/deviceGroup/SelectSort';
import SelectDevice from './routes/deviceGroup/SelectDevice';
import CreateDeviceGroup from './routes/deviceGroup/CreateDeviceGroup';
import GroupList from './routes/deviceGroup/GroupList';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="menu" component={Menu}>

          <Route path="mainPage" component={MainPage} />

          <Route path="accountDetail" component={AccountDetail} />
          <Route path="editNickName" component={EditNickName} />
          <Route path="editAddress" component={EditAddress} />
          <Route path="resetPassword" component={ResetPassword} />
          <Route path="profileSetting" components={ProfileSetting} />
          <Route path="feedback" component={Feedback} />
          <Route path="setting" component={Setting} />
          <Route path="help" component={Help} />
          <Route path="aboutUs" component={AboutUs} />

          <Route path="deviceMore/:productKey/:mac/:did" component={DeviceMore} />
          <Route path="addDeviceGroup/:productKey" component={AddDeviceGroup} />
          <Route path="addDeviceGroup/:productKey/:type/:gid" component={AddDeviceGroup} />

          <Route path="timing/:productKey/:did" component={Timing} >
            <Route path="list" component={TimingList} />
            <Route path="detail/:id/:type" component={TimingDetail} />
            <Route path="detail/:type" component={TimingDetail} />
          </Route>

          <Route path="groupTiming/:productKey/:did" component={GroupTiming} >
            <Route path="list" component={GroupTimingList} />
            <Route path="detail/:id/:type" component={GroupTimingDetail} />
            <Route path="detail/:type" component={GroupTimingDetail} />
            <Route path="subTiming/:type/:id" component={SubTimingDetail} />
            <Route path="subTiming/:type" component={SubTimingDetail} />
          </Route>

          <Route path="helpDetail/:parentID/:ID" component={HelpDetail} />
          <Route path="shareSingleDevice/:did" component={ShareSingleDevice} />
          <Route path="deviceSharing/:productKey/:mac/:did" component={DeviceSharing} />
          <Route path="startShareDevice" components={StartShareDevice} />
          <Route path="toShareUserDeviceList/:uid" component={ToShareUserDeviceList} />
          <Route path="toReceiveUserDeviceList/:uid" component={ToReceiveUserDeviceList} />

          <Route path="voiceTips" component={VoiceTips} />
          <Route path="echo" component={Echo} />
          <Route path="googleHome" component={GoogleHome} />

          <Route path="register" component={Register} />
          <Route path="setpass/:type" component={SetPassword} />
          <Route path="login" component={Login} />
          <Route path="forgotPassword" component={ForgotPassword} />

          <Route path="softAp/:productKey" component={SoftAp} />
          <Route path="account" component={Account} />
          <Route path="inputWifiPassword" component={InputWifiPassword} />
          <Route path="configWifi" component={ConfigWifi} />

          <Route path="searchDevice" component={SearchDevice} />
          <Route path="language" component={Language} />
          <Route path="airLink/:productKey" component={AirLink} />

          <Route path="devicePage/:productKey/:mac/:did" component={DevicePage} />
          <Route path="setTiming/:productKey/:mac/:did" component={SetTiming} />

          <Route path="addTiming/:id" component={AddTiming} />
          <Route path="scenarioDetail/:id" component={ScenarioDetail} />
          <Route path="scenarioFeatures/:id/:taskId/:productKey" component={ScenarioFeatures} />
          <Route path="scenarioFeaturesDetail/:id/:taskId/:productKey/:dataPoint" component={ScenarioFeaturesDetail} />
          <Route path="scenarioDeviceList/:id" component={ScenarioDeviceList} />
          <Route path="configTipsPage/:type/:productKey" component={ConfigTipsPage} />

          {/* 分组页面*/}
          <Route path="deviceGroupControl/:gid" component={DeviceGroupControl} />
          <Route path="editDeviceGroup/:gid" component={EditDeviceGroup} />
          <Route path="addDevice/:gid" component={AddDevice} />
          <Route path="selectSort" component={SelectSort} />
          <Route path="selectDevice/:pk" component={SelectDevice} />
          <Route path="createDeviceGroup/:gid" component={CreateDeviceGroup} />
          <Route path="groupList" component={GroupList} />
        </Route>

        <Route path="launch" component={Launch}>
          <Route path="guide" component={Guide} />
        </Route>
      </Route>
    </Router>
  );
}

export default RouterConfig;
