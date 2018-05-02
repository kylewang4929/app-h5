import { getLanguage } from '../utils/getLanguage';
import messageManagement from '../utils/messageManagement';

const language = getLanguage();
const setLanguageKey = localStorage.getItem('languageKey');
const setLanguageName = localStorage.getItem('languageName');

const defaultLanguage = setLanguageKey || language.key;
const defaultLanguageName = setLanguageName || language.name;

localStorage.setItem('languageKey', defaultLanguage);
localStorage.setItem('languageName', defaultLanguageName);
export default {
  namespace: 'language',
  state: {
    key: defaultLanguage,
    // name: 'en',
    name: defaultLanguageName,
  },
  subscriptions: {},
  effects: {
  },
  reducers: {
    update(state, action) {
      return { ...state, ...action.payload };
    },
    sendLanguage(state) {
      messageManagement.post('pushEvent', state, 'Language');
      return state;
    },
    updateLanguage(state, action) {
      localStorage.setItem('languageKey', action.payload.key);
      localStorage.setItem('languageName', action.payload.name);
      return { ...state, ...action.payload };
    },
  },
};
