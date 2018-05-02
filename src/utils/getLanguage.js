import { getLanguageConfig } from './configExpand';

const templateConfig = require('../config/template');

// 导入语言包
const enUS = require('../language/en_US.json');
const zhCN = require('../language/zh_CN.json');
const ja = require('../language/ja.json');

const getLanguageJson = (string) => {
  let languageJson = {};
  switch (string) {
    case 'zh': languageJson = zhCN; break;
    case 'zh-cn': languageJson = zhCN; break;
    case 'zh-hk': languageJson = zhCN; break;
    case 'zh-mo': languageJson = zhCN; break;
    case 'zh-tw': languageJson = zhCN; break;
    case 'ja': languageJson = ja; break;
    default: languageJson = enUS; break;
  }
  return languageJson;
};

const getLanguageString = (string, id) => {
  let languageJson = {};
  switch (string) {
    case 'zh': languageJson = zhCN; break;
    case 'zh-cn': languageJson = zhCN; break;
    case 'zh-hk': languageJson = zhCN; break;
    case 'zh-mo': languageJson = zhCN; break;
    case 'zh-tw': languageJson = zhCN; break;
    case 'ja': languageJson = ja; break;
    default: languageJson = enUS; break;
  }
  return languageJson[id];
};


/**
 * 判断当前语言并获取语言包
 * 这里除了判断语言，还需要比对，配置是否支持语言包
 * 因为这个方法会根据系统语言获取当前的语言
 * 所以如果是日语，但是配置上是不支持的，应该还是显示英文
 */
const getLanguage = () => {
  const obj = {
    key: (navigator.browserLanguage || navigator.language).toLowerCase(),
  };
  switch (obj.key) {
    case 'zh': obj.name = '中文'; obj.key = 'zh'; break;
    case 'zh-cn': obj.name = '中文'; obj.key = 'zh'; break;
    case 'zh-hk': obj.name = '中文'; obj.key = 'zh'; break;
    case 'zh-mo': obj.name = '中文'; obj.key = 'zh'; break;
    case 'zh-tw': obj.name = '中文'; obj.key = 'zh'; break;
    case 'ja': obj.name = '日文'; obj.key = 'ja'; break;
    case 'ja-JP': obj.name = '日文'; obj.key = 'ja'; break;
    case 'ja-jp': obj.name = '日文'; obj.key = 'ja'; break;
    default : obj.name = 'English'; obj.key = 'en'; break;
  }
  let isSupport = false;
  // 默认支持中文英文
  if (obj.key === 'zh') {
    isSupport = true;
  }
  if (obj.key === 'en') {
    isSupport = true;
  }
  templateConfig.languages.map((item) => {
    if (obj.key === item) {
      isSupport = true;
    }
  });
  if (!isSupport) {
    obj.name = 'English';
    obj.key = 'en';
  }
  return obj;
};

// 获取当前支持的语言列表
const getLanguageList = () => {
  const list = [
    {
      label: '中文',
      value: 'zh',
    },
    {
      label: 'English',
      value: 'en',
    },
  ];
  const language = getLanguageConfig();
  console.log('language', language);
  language.map((item) => {
    switch (item.key) {
      case 'ja': {
        list.push({
          label: '日本語',
          value: 'ja',
        });
        break;
      }
      default: {
        break;
      }
    }
  });
  return list;
};

export { getLanguageJson, getLanguageString, getLanguage, getLanguageList };
