import request from '../utils/schedulerRequest';
import { getOpenApiUrl } from '../utils/getServeInfo';

export async function create({ did, attrs, time, repeat, enabled, date, remark }) {
  const openApiUrl = getOpenApiUrl();
  const url = `${openApiUrl}app/devices/${did}/scheduler`;
  const options = {
    method: 'POST',
    body: JSON.stringify({
      attrs,
      repeat,
      enabled,
      time,
      date,
      remark,
    }),
  };

  return request(url, options);
}
export async function query({ did }) {
  const openApiUrl = getOpenApiUrl();
  const url = `${openApiUrl}app/devices/${did}/scheduler?limit=200`;
  const options = {
    method: 'GET',
  };
  return request(url, options);
}

export async function edit({ did, attrs, time, date, repeat, enabled, id, remark }) {
  const openApiUrl = getOpenApiUrl();
  const url = `${openApiUrl}app/devices/${did}/scheduler/${id}`;
  const options = {
    method: 'PUT',
    body: JSON.stringify({
      attrs,
      repeat,
      enabled,
      time,
      date,
      remark,
    }),
  };
  return request(url, options);
}

export async function deleteItem({ did, id }) {
  const openApiUrl = getOpenApiUrl();
  const url = `${openApiUrl}app/devices/${did}/scheduler/${id}`;
  const options = {
    method: 'DELETE',
  };
  return request(url, options);
}
