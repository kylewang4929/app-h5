// {
// "openAPIDomain" : "xxx", // NSString类型
// "openAPIPort" : xxx, // int类型
// "siteDomain" : "xxx", // NSString类型
// "sitePort" : xxx, // int类型
// }

const defaultServeInfo = {
  openAPIDomain: 'api.gizwits.com',
  openAPIPort: '80',
  siteDomain: 'site.gizwits.com',
  sitePort: '80',
};

const getServeInfo = () => {
  let serveInfo = {};
  if (!window.serveInfo) {
    serveInfo = defaultServeInfo;
  } else {
    serveInfo = window.serveInfo;
  }
  return serveInfo;
};

const getOpenApiUrl = () => {
  let serveInfo = {};
  if (!window.serveInfo) {
    serveInfo = defaultServeInfo;
  } else {
    serveInfo = window.serveInfo;
  }
  const url = `https://${serveInfo.openAPIDomain}/`;
  // if (serveInfo.openAPIPort === '80' || serveInfo.openAPIPort === 80) {
  //   url = `https://${serveInfo.openAPIDomain}/`;
  // } else {
  //   url = `https://${serveInfo.openAPIDomain}:${serveInfo.openAPIPort}/`;
  // }
  return url;
};

export { getServeInfo, getOpenApiUrl };
