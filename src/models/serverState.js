import { feedback } from '../services/server';
import { goBack } from '../utils/router';
import InfoAlert from '../components/InfoAlert';
import { getLanguageString } from '../utils/getLanguage';

export default {
  namespace: 'serverState',
  state: {},
  effects: {
    * feedback({ payload }, { call, select }) {
      const language = yield select(state => state.language);
      const FEEDBACK_SUCCESS = getLanguageString(language.key, 'FEEDBACK_SUCCESS');
      const FEEDBACK_FALURE = getLanguageString(language.key, 'FEEDBACK_FALURE');
      const data = yield call(feedback, payload);
      if (data.success) {
        goBack(-1);
        InfoAlert.show(FEEDBACK_SUCCESS);
      } else {
        InfoAlert.show(FEEDBACK_FALURE, 'error');
      }
    },
  },
  subscriptions: {},
  reducers: {
    update(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
