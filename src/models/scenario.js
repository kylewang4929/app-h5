import { query, create, update, deleteItem, execution } from '../services/scene';
import { getLanguageString } from '../utils/getLanguage';
import InfoAlert from '../components/InfoAlert';

const baseData = [
  {
    id: 'HOME',
    remark: '{"id": "HOME"}',
    icon: 'mdi mdi-home',
    name: 'HOME',
    tips: null,
    isDefault: true,
    isPreset: true,
    tasks: [],
    backgroundColor: '#fc803f',
  },
  {
    id: 'LEAVE_HOME',
    remark: '{"id": "LEAVE_HOME"}',
    icon: 'mdi mdi-car',
    name: 'WORK',
    tips: null,
    isDefault: true,
    isPreset: true,
    tasks: [],
    backgroundColor: '#67b337',
  },
  {
    id: 'GET_UP',
    remark: '{"id": "GET_UP"}',
    icon: 'mdi mdi-weather-sunset',
    name: 'GET_UP',
    tips: null,
    isDefault: true,
    isPreset: true,
    tasks: [],
    backgroundColor: '#ffb53f',
  },
  {
    id: 'SLEEP',
    remark: '{"id": "SLEEP"}',
    icon: 'mdi mdi-weather-night',
    name: 'SLEEP',
    tips: null,
    isDefault: true,
    isPreset: true,
    tasks: [],
    backgroundColor: '#4a78ff',
  },
];

export default {
  namespace: 'scenario',
  state: {
    data: baseData,
    activeItem: {},
    loading: false,
    isDefault: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    * query({ payload }, { call, put }) {
      if (payload && payload.backgroundLoad) {
        
      } else {
        yield put({
          type: 'loadingStart',
        });
      }
      const data = yield call(query);
      if (data.success) {
        yield put({ type: 'querySuccess', payload: { data: data.data } });
      }
      yield put({ type: 'loadingEnd' });
    },
    * create({ payload }, { call, put, select }) {
      const data = yield call(create, payload);
      const language = yield select(state => state.language);
      if (data.success) {
        payload.success && payload.success(data);
        yield put({ type: 'addSuccess', payload });
      } else {
        if (data.data.error_code === 9015 && data.data.detail_message.scene_name) {
          // 提示不可以用特殊字符
          const CANNOT_USE_SPECIAL_CHARACTERS = getLanguageString(language.key, 'CANNOT_USE_SPECIAL_CHARACTERS');
          InfoAlert.show(CANNOT_USE_SPECIAL_CHARACTERS, 'error', 2000);
        }
        payload.error && payload.error(data);
      }
      yield put({ type: 'loadingEnd' });
    },
    * update({ payload }, { call, put, select }) {
      const data = yield call(update, payload);
      const language = yield select(state => state.language);
      if (data.success) {
        payload.success && payload.success(data);
        yield put({ type: 'updateSuccess', payload });
      } else {
        if (data.data.error_code === 9015 && data.data.detail_message.scene_name) {
          // 提示不可以用特殊字符
          const CANNOT_USE_SPECIAL_CHARACTERS = getLanguageString(language.key, 'CANNOT_USE_SPECIAL_CHARACTERS');
          InfoAlert.show(CANNOT_USE_SPECIAL_CHARACTERS, 'error', 2000);
        }
        payload.error && payload.error(data);
      }
      yield put({ type: 'loadingEnd' });
    },
    * delete({ payload }, { call, put }) {
      const data = yield call(deleteItem, payload);
      if (data.success) {
        payload.success && payload.success(data);
        yield put({ type: 'deleteSuccess', payload });
      } else {
        payload.error && payload.error(data);
      }
      yield put({ type: 'loadingEnd' });
    },
    * execution({ payload }, { call, put }) {
      const data = yield call(execution, payload);
      if (data.success) {
        payload.success && payload.success(data);
      } else {
        payload.error && payload.error(data);
      }
      yield put({ type: 'loadingEnd' });
    },
  },

  reducers: {
    loadingStart(state) {
      return { ...state, loading: true };
    },
    loadingEnd(state) {
      return { ...state, loading: false };
    },
    deleteActiveItemTask(state, action) {
      let activeIndex = -1;
      state.activeItem.tasks.map((item, index) => {
        if (item.id === action.payload) {
          activeIndex = index;
        }
      });
      if (activeIndex !== -1) {
        state.activeItem.tasks.splice(activeIndex, 1);
      }
      return { ...state };
    },
    querySuccess(state, action) {
      const data = JSON.parse(JSON.stringify(baseData));
      action.payload.data.map((item) => {
        // 补充task id
        item.tasks.map((taskItem, taskIndex) => {
          taskItem.id = taskIndex + '';
        });
        /**
         * 两种情况 非预设的直接插入
         * 预设的更新到预设
         */
        const remark = JSON.parse(item.remark === '' ? '{}' : item.remark);
        if (remark.id) {
          // 存在id，所以是预设
          data.map((dataItem, dataIndex) => {
            if (dataItem.remark === item.remark) {
              data[dataIndex] = {
                ...data[dataIndex],
                ...item,
                isDefault: false,
              };
            }
          });
        } else {
          data.push({
            name: item.scene_name,
            ...item,
          });
        }
      });
      return { ...state, loading: false, data };
    },
    deleteSuccess(state, action) {
      let activeIndex = -1;
      state.data.map((item, index) => {
        if (item.id === action.payload.id) {
          activeIndex = index;
        }
      });
      if (activeIndex !== -1) {
        state.data.splice(activeIndex, 1);
      }
      return { ...state };
    },
    setActiveItem(state, action) {
      const languageKey = localStorage.getItem('languageKey');
      const SCENE = getLanguageString(languageKey, 'SCENE');
      let activeItem = {};
      if (action.payload.id === 'new') {
        activeItem = {
          name: SCENE,
          tasks: [],
        };
      } else {
        state.data.map((item) => {
          if (action.payload.id === item.id) {
            activeItem = JSON.parse(JSON.stringify(item));
          }
        });
      }
      return { ...state, activeItem };
    },
    updateTaskToActiveTask(state, action) {
      state.activeTask.attrs = {};
      state.activeTask.attrs[action.payload.data.dataPoint] = action.payload.data.value;
      return { ...state };
    },
    updateActiveTask(state, action) {
      state.activeTask = JSON.parse(JSON.stringify(action.payload));
      return { ...state };
    },
    updateNameToActiveItem(state, action) {
      state.activeItem.name = action.payload;
      return { ...state };
    },
    addTaskToActiveItem(state, action) {
      state.activeItem.tasks.push({
        ...state.activeTask, id: state.activeItem.tasks.length + '',
      });
      return { ...state };
    },
    updateTaskToActiveItem(state, action) {
      state.activeItem.tasks.map((item, index) => {
        if (item.id === state.activeTask.id) {
          state.activeItem.tasks[index] = {
            ...state.activeItem.tasks[index],
            ...state.activeTask,
          };
        }
      });
      return { ...state };
    },
    addActiveTask(state, action) {
      return { ...state, activeTask: action.payload };
    },
    // 添加数据点到chche的item
    // addTaskToActiveItem(state, action) {
    //   const { taskCache, activeItem } = state;
    //   const { data } = action.payload;
    //   taskCache.attrs[data.dataPoint] = data.value;
    //   taskCache.id = activeItem.tasks.length;
    //   activeItem.tasks.push(taskCache);
    //   return { ...state, activeItem };
    // },
    addSuccess(state, action) {
      state.data.push({
        name: action.payload.name,
      });
      return { ...state };
    },
  },

};
