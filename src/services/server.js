import request from '../utils/request';
import config from '../config/template';

const gizwitsConfig = config.gizwits;

export async function feedback(payload) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };

  return request(`${gizwitsConfig.serverHost}/server/feedback`, options);
}
