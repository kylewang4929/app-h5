# 超级App开发文档

> 解释App的基本结构，以及二次开发中需要注意的问题。前端部分使用的是antd-mobile的UI基础组件。数据层用了dva

## 多语言
> 根据系统语言判断加载哪个语言包，如果用户设置了语言，会被保存到localStorage，下次选择语言的时候就会默认使用用户选择的语言。如果要兼容低版本的ios，需要把`import 'intl';`加在index.js的最前面。

### 实现
多语言的实现分两种方式，一种是通过react组件的方式包裹文案ID，内部提供自动切换语言的功能。

例如：
![](http://obo7gtx2x.bkt.clouddn.com/react_translation.png)

还有一种是通过动态获取文案的方式，在一些不支持组件翻译的情况下会使用。
例如：
![](http://obo7gtx2x.bkt.clouddn.com/react_translation1.png)

### 增加新的语言
如果要增加新的语言，需要做两件事情：

* 在language文件夹增加一个新的JSON，里面对应的是这种语言的文案。
* 在`utils/browser.js`和`utils/getLanguage.js`补充语言对应的代码。

文案示例：
![](http://obo7gtx2x.bkt.clouddn.com/language.png)

`utils/browser.js`和`utils/getLanguage.js`示例：
![](http://obo7gtx2x.bkt.clouddn.com/getlanguage.png)
![](http://obo7gtx2x.bkt.clouddn.com/browser.png)

## 导航栏
> 统一封装了一个导航栏组件，内部会处理android status bar的颜色（ios采用沉浸式，android不采用的原因是目前没有开发status bar和底部导航栏的相关api，后续会升级）。

在每一个会有导航栏的页面请加上这段代码：

```
<div>
	<NavBar
	  title="ADD_DEVICE"
	  leftButton={<BackButton />}
	  rightButton={<SoftAp id={params.productKey} />}
	/>
	<div className="router-page">
	  
	</div>
</div>
```

其中NavBar组件中title代表的是标题栏的文字，leftButton和rightButton分别代表左边和右边的按钮。目前提供了一些默认带有功能的按钮，例如返回按钮，添加设备按钮等，可以直接调用，如果没有的话可以自行利用commonButton拓展。

![](http://obo7gtx2x.bkt.clouddn.com/button.png)

## 导航系统
> 由于一些特殊的需求，需要在路由跳转的时候做一些特有的处理，所以把页面跳转的功能封装起来了，实现在`utils/router.js`文件。如果不使用这个方法来处理页面跳转会导致动画和历史记录会存在一些问题。

![](http://obo7gtx2x.bkt.clouddn.com/router.png)

提供两个方法`router.go`和`router.goBack`。

示例：

```
// 跳转到setting页面，并且舍弃历史记录
router.go('#/menu/setting', []);

// 跳转到setting页面，重写路由栈，用#/menu/deviceList覆盖当前历史记录，此时按返回按钮会回到设备列表页面。
router.go('#/menu/setting', [{url: '#/menu/deviceList'}]);

// 后退一个页面
router.goBack(-1);

```

## 安卓物理返回键
> 安卓比较特殊，有个物理返回键，同时我们也需要处理两次点击返回退出App等操作，以及按返回键取消loading，弹窗之类的操作。

有个问题是，我们使用的`antd-mobile`的弹窗以及我们自己开发的弹窗都没有和物理返回键关联起来，也就是说安卓点击物理返回键后，app不知道要把弹窗关闭，所以我们根据几种不同类型的弹窗进行了封装。

主要思路是：

* 弹窗弹起的时候在window注册一个回调函数。
* 弹窗销毁时销毁回调函数。

这样在物理返回键的触发方法里加判断，如果有弹窗的时候优先先关闭弹窗，然后再后退页面。

### 弹窗实现示例
```
// 组件即将创建的时候注册回调到window
componentWillMount() {
	// onClose方法就是关闭这个弹窗的方法
	window.popupNav.myAlert = {
     handle: this.onClose,
   };
}
// 组件销毁的时候把注册到window的方法注销
componentWillUnmount() {
   window.popupNav.myAlert = null;
}
```

### 返回键回调处理

```
/**
 * 检查是否有弹窗
 */
if (!window.popupNav) {
  window.popupNav = {};
}
if (window.popupNav.toast) {
  window.popupNav.toast.handle();
  return;
}
if (window.popupNav.alert) {
  window.popupNav.alert.handle();
  return;
}
if (window.popupNav.myAlert) {
  window.popupNav.myAlert.handle();
  return;
}
if (window.popupNav.popup) {
  window.popupNav.popup.handle();
  return;
}

// 如果弹窗都不存在则调用返回键
```

## 高清方案（安卓不使用）
> 高分辨率屏幕大规模普及到时候，我们也要充分的利用屏幕的分辨率。所以在ios上采用了高清方案。但是在android上由于性能问题，为了开启GPU加速，舍弃了高清方案。

```
// index.js
// 只有ios才启用高清方案
if (getPlatform() === 'iOS') {
  flex(100, 1);
}
```

使用`antm-viewport`计算`fontsize`和设置`meta`。组件开发的时候全面使用rem即可。但是有些无法用rem的情况我们一般会用dp来辅助计算。

```
const dpr = typeof window !== 'undefined' && window.devicePixelRatio || 2;
```

安卓是不开启高清方案的，所以在android平台下，使用dp计算时记得把dp设置成1。

## 基本页面结构
### 含有导航栏的页面
```
<div>
	<NavBar
	  title="ADD_DEVICE"
	  leftButton={<BackButton />}
	  rightButton={<SoftAp id={params.productKey} />}
	/>
	<div className="router-page">
	  
	</div>
</div>
```

### 不含导航栏的页面
```
<div className="router-page">
	  
</div>
```

其中class`router-page`实际上是把当前这个div变成了铺满窗口的页面。最好加这个类，不加的话也没什么影响，后续会封装到`Page`组件里去。

## 页面切换动画
在`app.js`文件里使用了`CSSTransitionGroup`组件完成动画。

可以在`index.less`中找到页面切换动画的实现

```
.pageIn-enter {
	transform: translate3d(100%,0,0);
	transition: transform 0.275s cubic-bezier(0.4, 0.0, 0.2, 1);
	position: absolute;
	left: 0px;
	top: 0px;
	width: 100%;
	height: 100%;
}
.pageIn-enter.pageIn-enter-active {
	transform: translate3d(0,0,0);
}
.pageIn-leave {
	transform: translate3d(0,0,0);
	transition: transform 0.275s cubic-bezier(0.4, 0.0, 0.2, 1);
	position: absolute;
	left: 0px;
	top: 0px;
	width: 100%;
	z-index: 999;
	height: 100%;
}
.pageIn-leave.pageIn-leave-active {
	transform: translate3d(-100%,0,0);
}
.pageOut-enter {
	transform: translate3d(-100%,0,0);
	transition: transform 0.275s cubic-bezier(0.4, 0.0, 0.2, 1);
	position: absolute;
	left: 0px;
	top: 0px;
	width: 100%;
	height: 100%;
}
.pageOut-enter.pageOut-enter-active {
	transform: translate3d(0,0,0);
}
.pageOut-leave {
	transform: translate3d(0,0,0);
	transition: transform 0.275s cubic-bezier(0.4, 0.0, 0.2, 1);
	position: absolute;
	left: 0px;
	top: 0px;
	width: 100%;
	height: 100%;
	z-index: 999;
}
.pageOut-leave.pageOut-leave-active {
	transform: translate3d(100%,0,0);
}
```

如果需要实现其他页面切换动画，可以按照这个思路实现。

另外由于模版是通过iframe加载的，所以在跳转到模版页面的时候会先延时一段时间再跳转，实现是通过动画实现的，在动画上加了延时。

## 配置文件
> 可以通过配置文件去更改app的一些属性。

这部分功能还没有得到很好的支持，所以只建议更改颜色和pk之类的信息。

```
//product_ext.json
[
  {
    "categoryId": "light",
    "name": "智能灯",
    "en_name": "Smart Light",
    "productKey": "7e94ff3ceebe42acbf9e5f55cdc9a432",
    "productSecret": "fca0f635b36145d683682eccffc10fac",
    "templateId": "superapp-template-aidiLight",
    "templateVersion": "1.0.0",
    "softAPSSIDPrefix": "XPG-GAgent-",
    "powerAttr": "OnOff",
    "moduleType": [4],
    "airLink": {
    },
    "softAp": {
    }
  }
]
```

```
//template_ext.json
{
  "gizwits": {
    "iosAppID": "f7d3ad9208a24bd591b41b6ecdd6e20e",
    "iosAppSecret": "6b4c70f6add14af6aa3da1376decd597",
    "androidAppID": "b0a3b009f51b48d2b568322bc4a41f6f",
    "androidAppSecret": "71154ed6861d4517827f4b5e4f6e5dc0"
  }
}
```