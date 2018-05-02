import fetch from 'dva/fetch';
import config from '../config/template';
import errorCode from './errorCode';
import logout from './logout';
import InfoAlert from '../components/InfoAlert';
import { getLanguageString } from './getLanguage';

const gizwitsConfig = config.gizwits;

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

function parseJSON(response) {
  console.log(response);
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const token = localStorage.getItem('token');
  // 补充header

  // 判断平台
  let appID = gizwitsConfig.androidAppID;
  try {
    if (device.platform === 'Android') {
    // if (false) {
      appID = gizwitsConfig.androidAppID;
    } else {
      appID = gizwitsConfig.iosAppID;
    }
  } catch (error) {
    
  }
  options.headers = {
    'X-Gizwits-Application-Id': appID,
    'X-Gizwits-User-token': token,
  };
  return fetch(url, options).then(
    response => response.text().then(
      text => {
        let data = text;
        try {
          data = JSON.parse(text);
        } catch (ex) {
          checkError(ex.errorCode);
          console.log('error!!!!', ex.message);
        }
        return {
          data,
          status: response.status,
          success: response.ok,
        };
      },
    ),
  );
}
