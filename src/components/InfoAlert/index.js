
require('./styles.less');

class InfoAlert {
  constructor() {
    this.dom = null;
    this.timeout = null;
  }

  hasClass = (obj, cls) => {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  }

  addClass = (obj, cls) => {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
  }

  removeClass = (obj, cls) => {
    if (this.hasClass(obj, cls)) {
      const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      obj.className = obj.className.replace(reg, ' ');
    }
  }

  toggleClass = (obj, cls) => {
    if (this.hasClass(obj, cls)) {
      this.removeClass(obj, cls);
    } else {
      this.addClass(obj, cls);
    }
  }

  show = (text, type = 'success', delay = 2000) => {
    this.isRunAnimate = false;

    const body = document.getElementsByTagName('body')[0];
    let icon = '';
    switch (type) {
      case 'success': {
        icon = 'mdi mdi-checkbox-marked-circle-outline';
        break;
      }
      case 'error': {
        icon = 'mdi mdi-close-circle';
        break;
      }
      case 'warning': {
        icon = 'mdi mdi-alert-circle';
        break;
      }
      default: {
        icon = 'mdi mdi-checkbox-marked-circle-outline';
      }
    }

    // 创建dom
    const dom = document.createElement('div');
    dom.setAttribute('class', 'info-alert-box vertical-outer');

    const inner = document.createElement('div');
    inner.setAttribute('class', `info-alert-inner vertical-middle transform-animate ${type}`);

    const iconDom = document.createElement('span');
    iconDom.setAttribute('class', `info-icon ${icon}`);

    const textDom = document.createElement('span');
    textDom.setAttribute('class', 'info-text');
    const noteDom = document.createTextNode(text);
    textDom.appendChild(noteDom);

    const closeDom = document.createElement('span');
    closeDom.setAttribute('class', 'info-close mdi mdi-close');
    closeDom.addEventListener('click', this.hide.bind(null, dom));

    inner.appendChild(iconDom);
    inner.appendChild(closeDom);
    inner.appendChild(textDom);

    dom.appendChild(inner);

    inner.addEventListener('touchstart', this.onTouchStart);
    inner.addEventListener('touchmove', this.onTouchMove);
    inner.addEventListener('touchend', this.onTouchEnd);

    // 把inner存入dom中
    this.innerDom = inner;
    this.dom = dom;

    // 插入dom
    body.appendChild(dom);

    // 加动画
    setTimeout(() => {
      dom.setAttribute('class', 'info-alert-box vertical-outer in');
    }, 100);


    this.timeout = setTimeout(() => {
      this.hide(dom);
    }, delay);
  }
  onTouchStart = (e) => {
    if (this.isRunAnimate !== true) {
      const touch = e.touches[0];
      this.event = {
        startX: touch.pageX,
        startY: touch.pageY,
        flag: true,
      };
    }
  }
  onTouchMove = (e) => {
    if (this.event.flag && this.isRunAnimate !== true) {
      const touch = e.touches[0];
      const event = {
        startX: touch.pageX,
        startY: touch.pageY,
      };
      const offset = {
        offsetX: event.startX - this.event.startX,
        offsetY: event.startY - this.event.startY,
      };
      this.event.offsetX = offset.offsetX;
      this.innerDom.style.transform = `translateX(${offset.offsetX}px)`;
    }
  }
  onTouchEnd = (e) => {
    if (this.event.flag && this.isRunAnimate !== true) {
      this.event.flag = false;
      const { offsetX } = this.event;
      if (Math.abs(offsetX) > 100) {
        const innerOffsetX = offsetX > 0 ? '120%' : '-120%';
        this.innerDom.style.transform = `translateX(${innerOffsetX})`;
        this.isRunAnimate = true;
        setTimeout(() => {
          this.hide(this.dom);
        }, 300);
      } else {
        // 复位
        this.innerDom.style.transform = 'translateX(0px)';
        this.isRunAnimate = true;
        // 复位时isRunAnimate标记位也要改成false
        setTimeout(() => {
          this.isRunAnimate = false;
        }, 300);
      }
    }
  }
  hide = (dom) => {
    const body = document.getElementsByTagName('body')[0];

    dom.setAttribute('class', 'info-alert-box vertical-outer out');
    // 动画开始，应该加个锁
    this.isRunAnimate = true;

    setTimeout(() => {
      try {
        body.removeChild(dom);
      } catch (error) {
        console.log(error);
      }
    }, 275);
  }
}

export default new InfoAlert();
