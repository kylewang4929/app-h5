import Promise from 'promise';
import request from '../utils/schedulerRequest';
import config from '../config/template';
import { getOpenApiUrl } from '../utils/getServeInfo';

export async function query({ did, startime, endtime, attr, aggregator, unit }) {
  const openApiUrl = getOpenApiUrl();
  const url = `${openApiUrl}app/devdata/${did}/agg_data?start_ts=${startime}&end_ts=${endtime}&attrs=${attr}&aggregator=${aggregator}&unit=${unit}`;
  const options = {
    method: 'GET',
  };
  return request(url, options);
}