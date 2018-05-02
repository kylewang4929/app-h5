// app的配置文件拓展方法
import config from '../config/product';
import templateConfig from '../config/template';

const getProductSecret = (pk) => {
  let activeIndex = -1;
  config.map((item, index) => {
    if (item.productKey === pk) {
      activeIndex = index;
    }
  });
  return config[activeIndex].productSecret;
};

function getItemForCategoryId(id) {
  let activeIndex = -1;
  config.map((item, index) => {
    if (item.categoryId === id) {
      activeIndex = index;
    }
  });
  if (activeIndex !== -1) {
    return config[activeIndex];
  }
  return null;
}

function getItemForPk(id) {
  let activeIndex = -1;
  config.map((item, index) => {
    if (item.productKey === id) {
      activeIndex = index;
    }
  });
  if (activeIndex !== -1) {
    return config[activeIndex];
  }
  return null;
}

function searchTemplateUrl(pk) {
  const item = getItemForPk(pk);
  const url = `./template/${item.templateId}/index.html`;
  return url;
}

// 获取数据点配置文件
function getSceneDataPointConfig(pk, key) {
  const deviceItem = getItemForPk(pk);
  let dataPointConfig = {};
  deviceItem.scene.featureList.map((functionItem) => {
    if (functionItem.dataPoint === key) {
      // 匹配
      dataPointConfig = functionItem;
    }
  });
  return dataPointConfig;
}

function getProductKeys() {
  const productKeys = [];
  config.map((item) => {
    productKeys.push(item.productKey);
  });
  return productKeys;
}

// 获取pks
function getProductSecrets() {
  const productSecrets = [];
  config.map((item) => {
    productSecrets.push(item.productSecret);
  });
  return productSecrets;
}

function getLanguageConfig() {
  console.log('config.languages', templateConfig);
  return templateConfig.languages;
}

export {
  getItemForCategoryId,
  getItemForPk,
  searchTemplateUrl,
  getProductKeys,
  getProductSecret,
  getSceneDataPointConfig,
  getProductSecrets,
  getLanguageConfig,
};
