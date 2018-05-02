import request from '../utils/schedulerRequest';
import { getOpenApiUrl } from '../utils/getServeInfo';

/**
 * 查询所有的场景
 */
export async function query() {
  const openApiUrl = getOpenApiUrl();
  const url = `${openApiUrl}app/scene`;
  const options = {
    method: 'GET',
  };
  return request(url, options);
}

export async function create({ name, tasks, remark }) {
  const openApiUrl = getOpenApiUrl();
  const url = `${openApiUrl}app/scene`;
  const options = {
    method: 'POST',
    body: JSON.stringify({
      scene_name: name,
      remark: remark || '',
      tasks,
    }),
  };
  return request(url, options);
}

export async function update({ name, tasks, remark, id }) {
  const openApiUrl = getOpenApiUrl();
  const url = `${openApiUrl}app/scene/${id}`;
  const options = {
    method: 'PUT',
    body: JSON.stringify({
      id,
      scene_name: name,
      remark: remark || '',
      tasks,
    }),
  };
  return request(url, options);
}

export async function deleteItem({ id }) {
  const openApiUrl = getOpenApiUrl();
  const url = `${openApiUrl}app/scene/${id}`;
  const options = {
    method: 'DELETE',
  };
  return request(url, options);
}

export async function execution({ id }) {
  const openApiUrl = getOpenApiUrl();
  const url = `${openApiUrl}app/scene/${id}/task`;
  const options = {
    method: 'POST',
  };
  return request(url, options);
}
