# 模版开发文档
> 开发模版时有几个规范需要遵守，这里会简单的解释一下。建议使用我们的基础模版工程，在这个基础上进行开发。

## 多语言
> 模版的多语言方案和App可以用一样的，实际上也没有限制用什么方式去实现多语言。只需要通过`messageManagement.post('getLanguage', {});`接口获取语言代码，再根据语言代码实现翻译即可。

这里我们推荐用`react-intl`，再加上通过ID查找语言字符串的方式补全`react-intl`对脱离了文档的UI不支持的问题。参照App多语言文档。

## 高清方案
安卓默认使用(不使用高清方案是为了使用Gpu加速和性能优化)

`width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no,initial-scale=1`

ios通过使用`antm-viewport`来判断分辨率，更改`font-size`和视窗缩放比例，配和rem，实现高清方案。

这里我们可以这样处理

```
// 当前平台是ios的时候启动高清方案
if (getPlatform() === 'iOS') {
  flex(100, 1);
}

```

## App提供的接口
> App提供了一系列接口给模版调用，从而支持模版的功能实现。

messageManagement
是默认提供的一个类库，里面封装了一些行为，可以通过它来发送事件给app
如果不想用的话，通过
`window.parent.postMessage(data, '*');`
也可以实现同样的效果。

### 示例

```
// 第一个参数是事件名称，第二个参数是传给app的参数，第三个是回调
messageManagement.post('back', '', () => {});
```

### back
```
// 告诉app返回上一页
messageManagement.post('back', '', () => {});
```

### toggleStatusBar
```
// 显示和隐藏statue bar
// true 显示 false 隐藏
messageManagement.post('toggleStatusBar', true, () => {});
```

### setStatusBarStyle
这条接口不建议使用，暂时还没处理好安卓和ios的状态栏，安卓准备采用沉浸式处理状态栏，只设置状态栏的文字颜色。

```
/*

可选参数
{
  theme: {
  	backgroundColor: '',
  	color: '',
  }
}
*/
messageManagement.post('setStatusBarStyle', {}, () => {});
```

### goToDeviceMore

```
// 跳转到设备详情页面
messageManagement.post('goToDeviceMore', {}, () => {});
```

### linkFeature
目前只支持`timing `定时功能。并且产品的开关机数据点必须是`power`，如果不是power，请在`product_ext.json`文件把`"powerAttr": "OnOff",`加上。

```
// 跳转到公共功能页面
const obj = { id: 'timing' };
messageManagement.post('linkFeature', obj, () => {});
```

### sendCmd
其中data代表数据点，device代表设备对象，在Device监听可以获取得到设备对象（下面会介绍这个事件，但是其实是可以做优化把这device对象取消的，app是知道当前控制的是哪个设备对象，有计划做这个优化，这个版本还没处理。）。

```
messageManagement.post('sendCmd', { data: {
	power: true,
}, device: {
	did: '',
	mac: '',
	productKey: '',
} });
```

### getPlatform
获取当前平台
`目前支持 iOS 和 Android 两种`

```
messageManagement.post('Platform', {}, (data) => {
  const { message } = data;
  // message就是平台代码，目前支持 iOS 和 Android 两种
});
```

### getAndroidStatusBar
获取安卓状态栏高度

```
messageManagement.post('getAndroidStatusBar', {}, (data) => {
  const { message } = data;
  // message就是一个数字，单位是dp
});
```

## 可监听的事件
模版可以监听一些特殊的事件，app会把内容推送给模版。

### DeviceData
设备数据发生变化的时候会上报

```
// 用法
messageManagement.registerEvent('DeviceData', {}, (data) => {
	//data 就是推送过来的设备数据
	const { message } = data;
	/*
		message的结构
		{
			"did": {//设备数据点}
		}
	*/
	// 之所以加个did在前面是由于当时设计的时候考虑到可能会缓存页面，这样做的话会导致多个控制页面同时存在，可能会串的数据，所以加了个did进行校验，设备对象可以从Device监听拿到。
});
```

### Language
语言环境发生变化的时候会上报

```
messageManagement.registerEvent('Language', {}, (data) => {
  const { message } = data;
  /*
  message的结构
  {
  	key: '',
  	name: '',
  }
  key 代表语言代码，详情请查阅
  http://www.lingoes.cn/zh/translator/langcode.htm
  */
});
```

### Device
设备状态发生变化的时候会上报

```
messageManagement.registerEvent('Device', {}, (data) => {
  const { message } = data;
  // message 就是设备对象
});
```

### BackAction
安卓的物理返回键，监听了这个方法后，app会放弃处理自身的返回键事件，直到事件被销毁

```
messageManagement.registerEvent('BackAction', {}, () => {

});
```

### 销毁事件

```
messageManagement.registerEvent('BackAction', {}, this.backAction);

messageManagement.removeEvent('BackAction', {}, this.backAction);
```
