
/**
 * 目前只支持alert
 */

import { Modal } from 'antd-mobile';

const { alert } = Modal;

class ModalContainer extends Modal {
  static alert = (title, message, actions) => {
    const onClose = () => {
      window.popupNav.alert = null;
      console.log(window.popupNav);
    };
    actions.map((item, index) => {
      const { onPress } = item;
      const newFunction = () => {
        const data = onPress();
        if (data && data.then) {
          // Promise
          return new Promise((resolve, reject) => {
            data.then((data) => {
              resolve(data);
              onClose();
            }).catch((data) => {
              reject(data);
            });
          });
        } else {
          onClose();
        }
      };
      actions[index].onPress = newFunction;
    });
    const handle = alert(title, message, actions);
    if (!window.popupNav) {
      window.popupNav = {};
    }
    window.popupNav.alert = { handle: onClose };
    return handle;
  }
}

export default ModalContainer;
