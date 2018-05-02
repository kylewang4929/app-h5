/**
 * 对antd的toast进行封装，兼容android的返回键
 * toast的行为是返回键不可取消
 * toast同一时间只会存在一个
 */
import { Toast } from 'antd-mobile';

class ToastContainer {

  static timeout = null;

  static setData = (androidCanBack, duration) => {
    if (!window.popupNav) {
      window.popupNav={};
    }
    let onClose = () => {};
    if (androidCanBack) {
      onClose = () => {
        Toast.hide();
        window.popupNav.toast = null;
      };
    }
    window.popupNav.toast = { handle: onClose };

    /**
     * duration为null 则默认3秒
     * 0是不取消
     */
    if (duration === null) {
      clearTimeout(ToastContainer.timeout);
      ToastContainer.timeout = setTimeout(() => {
        ToastContainer.cleanData();
      }, 3 * 1000);
    }
    if (duration !== 0 && duration !== null) {
      clearTimeout(ToastContainer.timeout);
      ToastContainer.timeout = setTimeout(() => {
        ToastContainer.cleanData();
      }, duration * 1000);
    }
  }
  static cleanData = () => {
    window.popupNav.toast = null;
  }
  static success = (content, duration, onClose, mask, androidCanBack) => {
    ToastContainer.setData(androidCanBack, duration);
    Toast.success(content, duration, onClose, mask);
  }
  static fail = (content, duration, onClose, mask, androidCanBack) => {
    ToastContainer.setData(androidCanBack, duration);
    Toast.fail(content, duration, onClose, mask);
  }
  static info = (content, duration, onClose, mask, androidCanBack) => {
    ToastContainer.setData(androidCanBack, duration);
    Toast.info(content, duration, onClose, mask);
  }
  static loading = (content, duration, onClose, mask, androidCanBack) => {
    ToastContainer.setData(androidCanBack, duration);
    Toast.loading(content, duration, onClose, mask);
  }
  static offline = (content, duration, onClose, mask, androidCanBack) => {
    ToastContainer.setData(androidCanBack, duration);
    Toast.offline(content, duration, onClose, mask);
  }
  static hide = () => {
    ToastContainer.cleanData();
    Toast.hide();
  }
}

export default ToastContainer;
