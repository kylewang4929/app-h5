
import { Popup } from 'antd-mobile';

class PopupContainer {
  static setData = () => {
    if (!window.popupNav) {
      window.popupNav={};
    }
    const onClose = () => {
      Popup.hide();
      window.popupNav.popup = null;
    };
    window.popupNav.popup = { handle: onClose };
  }
  static cleanData = () => {
    window.popupNav.popup = null;
  }
  static show = (content, options) => {
    PopupContainer.setData();
    Popup.show(content, options);
  }
  static hide = () => {
    PopupContainer.cleanData();
    Popup.hide();
  }
}

export default PopupContainer;
