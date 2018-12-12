import queryString from 'query-string';

import request from '../utils/gizwitsRequest';
import config from '../config/template';
import { getOpenApiUrl } from '../utils/getServeInfo';

const gizwitsConfig = config.gizwits;

function openApiRequest(url, options, withToken = true) {
  let appID = gizwitsConfig.androidAppID;
  try {
    if (device.platform === 'Android') {
      appID = gizwitsConfig.androidAppID;
    } else {
      appID = gizwitsConfig.iosAppID;
    }
  } catch (error) {
    console.log(error);
  }
  appID = gizwitsConfig.androidAppID;

  const requestOptions = { ...options };
  const headers = {
    'Content-Type': 'application/json',
    'X-Gizwits-Application-Id': appID,
  };

  if (withToken) {
    headers['X-Gizwits-User-token'] = localStorage.getItem('token');
  }

  requestOptions.headers = { ...headers, ...options.headers };
  console.log('openApiRequest [option]', options);
  const openApiUrl = getOpenApiUrl();
  return request(openApiUrl + url, requestOptions);
}

export async function getShareUsers(payload) {
  console.log('service/openapi/getShareUsers');
  return openApiRequest(
    `app/sharing${payload ? `?${queryString.stringify(payload)}` : ''}`,
    { method: 'GET' });
}

export async function shareDevice({ body }) {
  console.log('server/openapi/shareDevice', body, JSON.stringify(body));
  return openApiRequest(
    'app/sharing',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  );
}

export async function replyShareOffer({ shareId, status }) {
  console.log('server/openapi/replyShareOffer', shareId, status);
  return openApiRequest(
    `app/sharing/${shareId}?status=${status}`,
    { method: 'PUT' },
  );
}

export async function cancelShareDevice({ shareId }) {
  console.log('server/openapi/cancelShareDevice', shareId);
  return openApiRequest(
    `app/sharing/${shareId}`,
    { method: 'DELETE' },
  );
}

export async function setUserAlias({ shareId, userAlias }) {
  console.log('server/openapi/setUserAlias', shareId, userAlias);
  return openApiRequest(
    `app/sharing/${shareId}/alias?user_alias=${userAlias}`,
    { method: 'PUT' },
  );
}

export async function setCustomInfo({ remark, alias, device }) {
  return openApiRequest(
    `app/bindings/${device.did}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        remark,
        dev_alias: alias,
      }),
    },
  );
}


export async function forgotPassword(payload) {
  console.log('/app/reset_password', payload, JSON.stringify(payload));
  return openApiRequest(
    'app/reset_password',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    false,
  );
}

export async function getGroups() {
  console.log('/app/group');
  return openApiRequest(
    'app/group',
    { method: 'GET' },
  );
}

export async function createGroup({ productKey, groupName }) {
  console.log('post /app/group', productKey, groupName);
  return openApiRequest(
    'app/group',
    {
      method: 'POST',
      body: JSON.stringify({
        product_key: productKey,
        group_name: groupName,
      }),
    },
  );
}

export async function sharingCode({ code }) {
  console.log('post /sharing/code', code);
  return openApiRequest(
    `app/sharing/code/${code}`,
    {
      method: 'POST',
    },
  );
}
