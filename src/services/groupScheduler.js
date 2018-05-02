import Promise from 'promise';
import { create, edit, deleteItem } from './scheduler';

export async function save(list) {
  const promise = [];
  list.map((item) => {
    switch (item.type) {
      case 'delete': {
        promise.push(deleteItem({ ...item }));
        break;
      }
      case 'create': {
        promise.push(create({ ...item }));
        break;
      }
      default: {
        promise.push(edit({ ...item }));
      }
    }
  });
  return Promise.all(promise);
}
