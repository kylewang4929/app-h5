# 快速登录
> 需要做几件事情。第一件是增加配置文件，第二件是插入cordova插件。

## 增加配置文件
在`./src/config/template_ext.json`中插入:

```
{
  "gizwits": {
    ...
  },
  "app": {
    ...
    "quickLogin": [
      { "id": "qq", "label": "QQ", "appID": "1106328937" },
      { "id": "wechat", "label": "WECHAT", "appID": "wx151af7f2cd3ff605", "secret": "39b42ec96393c4f34672ea72c9da8c85" },
      { "id": "sina", "label": "WEIBO", "appID": "459483732" }
    ]
  }
}
```

目前支持

```
[
    { "id": "qq", "label": "QQ", "appID": "1106328937" },
    { "id": "wechat", "label": "WECHAT", "appID": "wx151af7f2cd3ff605", "secret": "39b42ec96393c4f34672ea72c9da8c85" },
    { "id": "sina", "label": "WEIBO", "appID": "459483732" },
    { "id": "google", "label": "GOOGLE", "appID": "com.googleusercontent.apps.183481141732-2cus3hft2vkoaj5prtirqsqhoemg0q0k" },
    { "id": "twitter", "label": "TWITTER", "appID": "459483732" },
    { "id": "facebook", "label": "FACEBOOK", "appID": "459483732" },
]
```
其中微信要带上`secret`。

google如果申请的id是如果 id 是：

`183481141732-2cus3hft2vkoaj5prtirqsqhoemg0q0k.apps.googleusercontent.com`

那么填写进来的appID要反过来，即：

`com.googleusercontent.apps.183481141732-2cus3hft2vkoaj5prtirqsqhoemg0q0k`

## 插入cordova插件

### wechat:
`cordova plugin add cordova-plugin-wechat --variable wechatappid=YOUR_WECHAT_APPID`

### qq:
`plugin add cordova-plugin-qqsdk --variable QQ_APP_ID=YOUR_QQ_APPID`

### sina:
`cordova-plugin-weibosdk --variable WEIBO_APP_ID=YOUR_WEIBO_APPID`

### facebook:
`cordova plugin add cordova-plugin-facebook4 --save --variable APP_ID="123456789" --variable APP_NAME="myApplication"`

### google:
`cordova plugin add cordova-plugin-googleplus --save --variable REVERSED_CLIENT_ID=myreversedclientid`

如果 id 是：

`183481141732-2cus3hft2vkoaj5prtirqsqhoemg0q0k.apps.googleusercontent.com`

那么插入插件时的id是：

`com.googleusercontent.apps.183481141732-2cus3hft2vkoaj5prtirqsqhoemg0q0k`

### twitter:

`cordova plugin add twitter-connect-plugin --variable FABRIC_KEY=API_KEY`

根据需要插入相关插件即可。