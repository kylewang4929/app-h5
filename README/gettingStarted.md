# Getting Started
> 一个快速运行项目的指引。

# 依赖的环境

```
// 请到官网下载或用homebrew安装
nodejs(6.11.2)

// 安装cordova
sudo npm install -g cordova

// 安装dva-cli
npm install dva-cli -g

// 安装ionic，制作icon和启动画面的时候会需要用到
npm install -g ionic@latest

// 安装ios-deploy
npm install -g ios-deploy

```


### 一、运行模版

* 拉取`git@gitlab.gizwits.com:superAppGcp/com.gizwits.socket.1.git`。
* npm install
* npm start
* 把models/language里state的isDefault改成false（这是个bug，上线的时候记得改回true，暂时没有比较好的解决方案）。

这个时候就可以在浏览器看到运行中的模版了。

### 二、拉取wifiSdk
* 拉取`git@gitlab.gizwits.com:superAppGcp/cordova-wifisdk-plugin.git`。

### 三、拉取cordova-container
* 拉取`git@gitlab.gizwits.com:superAppGcp/cordova-container.git`。
* 添加插件`cordova plugin add ****`。（这里需要添加一个Gizwits的wifiSdk，路径填上面那个`wifiSdk`的根目录即可）
* 添加平台`cordova platform add android`和`cordova platform add ios`。

这里有个坑，有个插件有问题。

打开`platforms/ios/cordova/node_modules/ios-sim/src/lib.js`，
把282行的

```
var remove = function(runtime) {
    // remove "iOS" prefix in runtime, remove prefix "com.apple.CoreSimulator.SimDeviceType." in id
    list.push(util.format('%s, %s', name_id_map[ deviceName ].replace(/^com.apple.CoreSimulator.SimDeviceType./, ''), runtime.replace(/^iOS /, '')));
};
```

换成

```
var remove = function(runtime) {
    // remove "iOS" prefix in runtime, remove prefix "com.apple.CoreSimulator.SimDeviceType." in id
    if (name_id_map[deviceName] && runtime) {
        list.push(util.format('%s, %s', name_id_map[deviceName].replace(/^com.apple.CoreSimulator.SimDeviceType./, ''), runtime.replace(/^iOS /, '')));
    }
};
```

### 四、运行superApp

* 拉取`git@gitlab.gizwits.com:superAppGcp/gizwits-super-app.git`。
* npm install
* npm start

这里有几个地方需要注意。

根目录下的static和template下的文件夹用pk命名，然后app在运行的时候就会去加载这些内容（图片和模版）。但是在浏览器环境调试的时候是加载不到图片和模版的，因为浏览器环境挂载在了一个小web服务器上，暂时没有把图片和模版等静态文件扔上去。所以要打包运行后才能看到完整的效果。

### 五、打包模版

* 在模版文件夹运行npm run build。
* 把生成的dist文件夹，拷贝到superApp的template文件夹（dist文件夹需要重命名为`product_ext.json`中对应产品的templateId字段）。

### 六、打包SuperApp
把superApp文件夹下的deploy.sh中的path改成cordovaContainer的绝对地址

```
# the path of cordova project root
path=/Users/kyleWang/Documents/Project/cordovaContainer
```

打包脚本默认运行虚拟设备`cordova emulate ios`。

如果有其他需要的话可以改成

```
cordova build ios
cordova build android

cordova run ios
cordova run android
```

其中ios可能会有证书的问题，如果证书有问题的话可以用xCode打开工程，build一次，成功后就可以用命令了。

* 在superApp文件夹运行`bash deploy.sh`。

至此就完成了app的构建，就能在手机上看到app了。

### 定制icon和启动画面

如果需要替换自己的icon和启动画面，可以在cordovaContainer下的resources文件夹里替换`icon.png`和`splash.png`文件，再运行`ionic cordova resources`。
