import router from './router';

export default () => {
  localStorage.removeItem('uid');
  localStorage.removeItem('token');
  // 切换路由
  router.go('#/launch/guide');
  localStorage.removeItem('deviceList');
};
