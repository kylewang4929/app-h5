import Promise from 'promise';
import { getLanguageString } from '../utils/getLanguage';
import InfoAlert from '../components/InfoAlert';
import request from '../utils/request';
import { apiLogin } from './gizwitsSdk';
import appConfig from '../config/template';

const quickLoginConfig = appConfig.app.quickLogin;

// 第三方sdk返回的错误
function loginError() {
  // 可能是用户取消了授权 可以在这里提示失败
  const languageKey = localStorage.getItem('languageKey');
  const AUTH_LOGIN_FAILED = getLanguageString(languageKey, 'AUTH_LOGIN_FAILED');
  InfoAlert.show(AUTH_LOGIN_FAILED, 'error', 2000);
}

// 统一处理成功时的token和uid保存
function apiLoginSuccess(data) {
  // 保存token
  localStorage.setItem('uid', data.data.uid);
  localStorage.setItem('token', data.data.token);
}

// 统一处理错误
function apiLoginError() {
  // 保存token
  const languageKey = localStorage.getItem('languageKey');
  const LOGIN_FAILED_PLEASE_TRY_AGAIN = getLanguageString(languageKey, 'LOGIN_FAILED_PLEASE_TRY_AGAIN');
  InfoAlert.show(LOGIN_FAILED_PLEASE_TRY_AGAIN, 'error', 2000);
}

// 调用云端登录api
function login(authData, resolve, reject) {
  apiLogin({ authData }).then((data) => {
    if (data.success) {
      apiLoginSuccess(data);
      resolve(data);
    } else {
      apiLoginError(data);
      reject(data);
    }
  }).catch((err) => {
    reject(err);
  });
}

function wechatLogin(loginData, resolve, reject) {
  const { code } = loginData;

  let config = null;
  quickLoginConfig.map((item) => {
    if (item.id === 'wechat') {
      config = item;
    }
  });

  // 用code换取token
  const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.appID}&secret=${config.secret}&code=${code}&grant_type=authorization_code`;
  request(url).then((data) => {
    // 请求成功
    const { access_token, openid } = data.data;
    const authData = {
      src: 'wechat',
      uid: openid,
      token: access_token,
      token_secret: config.secret,
    };
    login(authData, resolve, reject);
  }).catch((err) => {
    // 失败
    loginError(err);
  });
}

export async function quickLogin({ type }) {
  const promise = new Promise((resolve, reject) => {
    switch (type) {
      case 'qq': {
        const args = {};
        args.client = QQSDK.ClientType.QQ;
        QQSDK.ssoLogin((result) => {
          const authData = {
            src: 'qq',
            uid: result.userid,
            token: result.access_token,
            token_secret: null,
          };
          login(authData, resolve, reject);
        }, (err) => {
          loginError(err);
          reject(err);
        }, args);
        break;
      }
      case 'wechat': {
        const scope = 'snsapi_userinfo';
        const state = '_' + (+new Date());
        Wechat.auth(scope, state, (data) => {
          console.log('微信的第三方登录有点不一样');
          wechatLogin({ code: data.code }, resolve, reject);
        }, (err) => {
          loginError(err);
          reject(err);
        });
        break;
      }
      case 'sina': {
        WeiboSDK.ssoLogin((args) => {
          const authData = {
            src: 'sina',
            uid: args.userId,
            token: args.access_token,
            token_secret: null,
          };
          // 调用登录api
          login(authData, resolve, reject);
        }, (err) => {
          loginError(err);
          reject(err);
        });
        break;
      }
      case 'facebook': {
        facebookConnectPlugin.login(['public_profile'], (userData) => {
          console.log('userData', userData);
          const authData = {
            src: 'facebook',
            uid: userData.authResponse.userID,
            token: userData.authResponse.accessToken,
            token_secret: null,
          };
          // 调用登录api
          login(authData, resolve, reject);
        }, (err) => {
          loginError(err);
          reject(err);
        });
        break;
      }
      case 'google': {
        window.plugins.googleplus.login({},
          (obj) => {
            const authData = {
              src: 'google',
              uid: obj.userId,
              token: obj.accessToken,
              token_secret: null,
            };
            // 调用登录api
            login(authData, resolve, reject);
          }, (err) => {
            loginError(err);
            reject(err);
          },
        );
        break;
      }
      case 'twitter': {
        TwitterConnect.login((result) => {
          const authData = {
            src: 'twitter',
            uid: result.userId,
            token: result.token,
            token_secret: result.secret,
          };
          // 调用登录api
          login(authData, resolve, reject);
        }, (err) => {
          loginError(err);
          reject(err);
        });
        break;
      }
      default: {
        console.log('err');
      }
    }
  });
  return promise;
}
