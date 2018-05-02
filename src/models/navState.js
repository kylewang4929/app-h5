import config from '../config/template';

const colorConfig = config.app.color;

export default {

  namespace: 'navState',

  state: {
    hasShadow: true,
    title: '',
    rightButton: '',
    leftButton: '',
    theme: {},
    uuid: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
  },

  reducers: {
    update(state, action) {
      if (!action.payload.theme) {
        action.payload.theme = {};
      }
      // const color = action.payload.theme.backgroundColor || colorConfig.topNavBackground;
      // if (color) {
      //   try {
      //     if (device.platform === 'Android') {
      //       if (color === '#fff' || color === '#ffffff') {
      //         window.StatusBar.backgroundColorByHexString('#dadada');
      //       } else {
      //         window.StatusBar.backgroundColorByHexString(color);
      //       }
      //     }

      //     if (color === '#fff' || color === '#ffffff' || color === 'rgb(255,255,255)' || color === 'rgba(255,255,255, 1)') {
      //       window.StatusBar.styleDefault();
      //     } else {
      //       window.StatusBar.styleLightContent();
      //     }
      //   } catch (error) {
      //     console.log(error);
      //   }
      // }
      // /**
      //  * 复位
      //  */
      if (state.isTransparent && !action.payload.isTransparent) {
        action.payload.isTransparent = false;
      }
      return { ...state, ...action.payload };
    },
  },

};
