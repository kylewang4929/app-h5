const getRouterStack = () => {
  let routerStack = sessionStorage.getItem('routerStack');
  if (routerStack == null) routerStack = '[]';
  routerStack = JSON.parse(routerStack);
  return routerStack;
};
const setRouterStack = (routerStack) => {
  sessionStorage.setItem('routerStack', JSON.stringify(routerStack));
};

/**
 * 如果当前要前往另一个页面，
 * 并且当前页面是设备页面，加上锁
 * 如果要前往的页面是设备页面，则解除锁
 */
const checkPageState = (target) => {
  const url = window.location.hash;
  try {
    if (target.indexOf('#/menu/devicePage') !== -1) {
      // 解除锁
      window.templateStatusBarLock = false;
    } else if (url.indexOf('#/menu/devicePage') !== -1) {
      // 加锁
      window.templateStatusBarLock = true;
    }
  } catch (error) {
  }
};

/**
 * routerState 约定 0是回退 1是前进
 */
const back = (num) => {
  localStorage.setItem('routerState', 0);
  const routerStack = getRouterStack();
  if (num < 0) {
    setTimeout(() => {
      num = Math.abs(num);
      let nextRouter = null;
      for (let i = 0; i < num; i++){
        nextRouter = routerStack.pop();
      }
      // 保存路由
      setRouterStack(routerStack);
      console.log('nextRouter', nextRouter);
      // 检查是否需要加锁
      checkPageState(nextRouter.url);
      window.location.hash = nextRouter.url;
      // history.go(num);
    });
  }
};

class Router {
  goBack = (num) => {
    // 返回太快会有一个问题 react会无法正常执行生命周期 在有动画的情况下
    if (this.disableBack !== true) {
      setTimeout(() => {
        back(num);
      }, 50);
      this.disableBack = true;
      clearTimeout(this.timeout);
      // 375毫秒内不可返回
      this.timeout = setTimeout(() => {
        this.disableBack = false;
      }, 375);
    }
  }
  // 覆盖路由 router.go('#menu/feedback', [{url: '#/menu/mainPage'}]);
  go = (url, stack) => {
    let routerStack = getRouterStack();
    const obj = {
      url: window.location.hash,
    };
    routerStack.push(obj);

    // 检查是否需要加锁
    checkPageState(url);

    // 保存到当前路由
    this.currentRouter = url;

    // 覆盖路由栈
    if (stack) {
      routerStack = stack;
    }

    localStorage.setItem('routerState', 1);
    setTimeout(() => {
      window.location.hash = url;
    });

    // 保存路由
    setRouterStack(routerStack);
  }
}

export default new Router();
