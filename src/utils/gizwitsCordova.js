import Promise from 'promise';
import logout from './logout';
import errorCode from './errorCode';
import InfoAlert from '../components/InfoAlert';
import { getLanguageString } from './getLanguage';

function checkError(code) {
  const languageKey = localStorage.getItem('languageKey');
  const LOGIN_EXPIRED = getLanguageString(languageKey, 'LOGIN_EXPIRED');
  switch (code) {
    case errorCode.GIZ_SDK_TOKEN_INVALID: {
      logout();
      InfoAlert.show(LOGIN_EXPIRED, 'error', 3000);
      break;
    }
    case errorCode.TOKEN_INVALID: {
      logout();
      InfoAlert.show(LOGIN_EXPIRED, 'error', 3000);
      break;
    }
    case errorCode.TOKEN_INVALID_USER_NOT_EXIST: {
      logout();
      InfoAlert.show(LOGIN_EXPIRED, 'error', 3000);
      break;
    }
    case errorCode.TOKEN_INVALID_TOKEN_EXPIRED: {
      logout();
      InfoAlert.show(LOGIN_EXPIRED, 'error', 3000);
      break;
    }
    default: {
      break;
    }
  }
}

export default (moduleName, key, options) => {
  console.log(key, options);
  const promise = new Promise((resolve) => {
    const successCallBack = (data) => {
      const obj = {
        success: true,
        data,
      };
      console.log(moduleName, key, obj);
      resolve(obj);
    };

    const errorCallBack = (err) => {
      const obj = {
        success: false,
        data: err,
      };
      // token过期 跳到登录
      checkError(err.errorCode);
      resolve(obj);
      console.log(key, obj);
    };
    try {
      if (!options) {
        cordova.plugins[moduleName][key](successCallBack, errorCallBack);
      } else {
        cordova.plugins[moduleName][key](options, successCallBack, errorCallBack);
      }
    } catch (error) {
      console.log(`${key}error:${error}`);
    }
  });

  return promise;
};
