import { createAndAdd, query, deleteGroup, rename, addDevice, deleteDevice } from '../services/deviceGroup';
import { getLanguageString } from '../utils/getLanguage';
import InfoAlert from '../components/InfoAlert';
import { getItemForPk } from '../utils/configExpand';

export default {

  namespace: 'deviceGroup',

  state: {
    data: [],
    tempData: [],
  },

  effects: {
    * createAndAddDevice({ payload }, { call, select }) {
      const language = yield select(state => state.language);
      const data = yield call(createAndAdd, {
        product_key: payload.productKey,
        group_name: payload.groupName,
        dids: payload.dids,
      });
      if (data.success) {
        payload.success && payload.success(data.data);
      } else {
        if (data.data.error_code == 9015) {
          // 提示不可以用特殊字符
          const CANNOT_USE_SPECIAL_CHARACTERS = getLanguageString(language.key, 'CANNOT_USE_SPECIAL_CHARACTERS');
          InfoAlert.show(CANNOT_USE_SPECIAL_CHARACTERS, 'error', 2000);
        } else if (data.data.error_code == 9206) {
          // 提示分组名重复
          const GROUPING_NAMES_ALREADY_EXITS = getLanguageString(language.key, 'GROUPING_NAMES_ALREADY_EXITS');
          InfoAlert.show(GROUPING_NAMES_ALREADY_EXITS, 'error', 2000);
        }
        payload.error && payload.error(data.data);
      }
    },
    * updateGroupDevices({ payload }, { call, select }) {
      // 先删除 再添加
      const groupList = yield select(state => state.deviceGroup);
      const oldDids = [];
      groupList.data.map((item) => {
        if (item.id === payload.gid) {
          // 获取设备的dids
          const { devices } = item;
          devices.map((deviceItem) => {
            oldDids.push(deviceItem.did);
          });
        }
      });
      let deleteData = null;
      if (oldDids.length > 0) {
        deleteData = yield call(deleteDevice, {
          dids: oldDids,
          gid: payload.gid,
        });
      }

      if (deleteData.success) {
        const data = yield call(addDevice, {
          dids: payload.dids,
          gid: payload.gid,
        });
        if (data.success) {
          payload.success && payload.success(data.data);
        } else {
          payload.error && payload.error(data.data);
        }
      } else {
        payload.error && payload.error(deleteData.data);
      }
    },
    * query({ payload }, { call, put }) {
      const data = yield call(query);
      if (data.success) {
        yield put({
          type: 'update',
          payload: data.data,
        });
        if (payload.success) payload.success(data.data);
      } else {
        if (payload.error) payload.error(data.data);
      }
    },
    * delete({ payload }, { call, put }) {
      const data = yield call(deleteGroup, { id: payload.id });
      if (data.success) {
        yield put({
          type: 'deleteItem',
          payload: {
            id: payload.id,
          },
        });
        if (payload.success) payload.success(data.data);
      } else {
        if (payload.error) payload.error(data.data);
      }
    },
    * rename({ payload }, { call, put, select }) {
      const { id, name } = payload;
      const data = yield call(rename, { id, name });
      const language = yield select(state => state.language);
      if (data.success) {
        yield put({
          type: 'renameSuccess',
          payload: { id, name },
        });
        if (payload.success) payload.success(data.data);
      } else {
        if (data.data.error_code === 9015 && data.data.detail_message.scene_name) {
          // 提示不可以用特殊字符
          const CANNOT_USE_SPECIAL_CHARACTERS = getLanguageString(language.key, 'CANNOT_USE_SPECIAL_CHARACTERS');
          InfoAlert.show(CANNOT_USE_SPECIAL_CHARACTERS, 'error', 2000);
        }
        if (payload.error) payload.error(data.data);
      }
    },
  },

  reducers: {
    update(state, action) {
      const list = [];
      action.payload.map((item, index) => {
        // 这里需要做一个兼容，有时候添加了一个分组，里面是某个pk，但是由于各种原因，后面不用这个产品了，就会导致这里一个错误
        if (getItemForPk(item.product_key)) {
          action.payload[index].productKey = item.product_key;
          list.push(action.payload[index]);
        }
      });
      return { ...state, data: list };
    },
    updateTemp(state, action) {
      action.payload.map((item, index) => {
        action.payload[index].productKey = item.product_key;
      });
      return { ...state, tempData: JSON.parse(JSON.stringify(action.payload)) };
    },
    renameSuccess(state, action) {
      state.data.map((item, index) => {
        if (item.id === action.payload.id) {
          state.data[index].name = action.payload.name;
        }
      });
      return { ...state };
    },
    deleteItem(state, action) {
      let deleteIndex = -1;
      state.data.map((item, index) => {
        if (item.id === action.payload.id) {
          deleteIndex = index;
        }
      });
      if (deleteIndex !== -1) {
        state.data.splice(deleteIndex, 1);
      }
      return { ...state };
    },
  },
};
