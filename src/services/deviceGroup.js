import Promise from 'promise';
import request from '../utils/schedulerRequest';
import config from '../config/template';
import { getOpenApiUrl } from '../utils/getServeInfo';

const gizwitsConfig = config.gizwits;

export async function create({ product_key, group_name }) {
  const openApiUrl = getOpenApiUrl();
  const url = `${openApiUrl}app/group`;
  const options = {
    method: 'POST',
    body: JSON.stringify({
      product_key,
      group_name,
    }),
  };
  return request(url, options);
}

export async function addDevice({ gid, dids }) {
  const openApiUrl = getOpenApiUrl();
  const url = `${openApiUrl}app/group/${gid}/devices`;
  const options = {
    method: 'POST',
    body: JSON.stringify({
      dids,
    }),
  };
  return request(url, options);
}

export async function deleteDevice({ gid, dids }) {
  const openApiUrl = getOpenApiUrl();
  const url = `${openApiUrl}app/group/${gid}/devices`;
  const options = {
    method: 'DELETE',
    body: JSON.stringify({
      dids,
    }),
  };
  return request(url, options);
}


export async function createAndAdd({ product_key, group_name, dids }) {
  const result = await create({ product_key, group_name });
  if (result.success) {
    // 创建分组成功
    return await addDevice({ dids, gid: result.data.id });
  }
  return result;
}

export async function queryGroupDevices({ gid }) {
  const url = `${gizwitsConfig.openApiUrl}app/group/${gid}/devices`;
  const options = {
    method: 'GET',
  };
  return request(url, options);
}

export async function query() {
  const openApiUrl = getOpenApiUrl();
  const url = `${openApiUrl}app/group`;
  const options = {
    method: 'GET',
  };
  const result = await request(url, options);
  const promiseAll = [];
  if (result.success) {
    // 查询分组成功，获取分组里的设备
    result.data.map((item, index) => {
      promiseAll.push(queryGroupDevices({ gid: item.id }));
    });
    const getDevicesResult = await Promise.all(promiseAll);
    getDevicesResult.map((item, index) => {
      result.data[index].devices = item.data;
    });
    return result;
  }
  return result;
}

export async function rename({ id, name }) {
  const openApiUrl = getOpenApiUrl();
  const url = `${openApiUrl}app/group/${id}`;
  const options = {
    method: 'PUT',
    body: JSON.stringify({
      group_name: name,
    }),
  };
  return request(url, options);
}

// groupWrite({gid: '1', data: { abc: [1, 10, 0] }});

//格式化数组，加个0
function formattingNum(num) {
  return (Array(2).join(0) + num).slice(-2);
}

export async function groupWrite({ gid, data }) {
  /**
   * 这里需要做一个转换，如果是十进制数组x`
   * 要转换成16进制字符
   */
  for (const key in data) {
    if (data[key] instanceof Array) {
      // 是数组 转换一下
      let text = '';
      data[key].map((item, index) => {
        text += formattingNum(item.toString(16));
      });
      data[key] = text;
    }
  }

  console.log(data);

  const openApiUrl = getOpenApiUrl();
  const url = `${openApiUrl}app/group/${gid}/control`;
  const options = {
    method: 'POST',
    body: JSON.stringify({
      attrs: data,
    }),
  };
  return request(url, options);
}

export async function deleteGroup({ id }) {
  const openApiUrl = getOpenApiUrl();
  const url = `${openApiUrl}app/group/${id}`;
  const options = {
    method: 'DELETE',
  };
  return request(url, options);
}
