const config = require('./template_ext.json');

// 应用程序相关的配置文件
const baseConfig = {
  app: {
    loginStyle: 0, // 0默认设计 1空净那个的设计
    appNameZh: '智能插座', // 中文名
    appNameEn: 'Smart Socket', // 英文名
    appID: 'gizwits1112',
    bundleID: 'com.gizwits.socket', // 包名
    // 应用图标 启动图 直接替换cordova工程资源文件
    // 证书保存在服务器
    color: {
      tintColor: '#80c7e8',
      topNavBackground: '#80c7e8', // 顶部标题栏背景颜色
      topNavColor: '#fff', // 顶部标题栏文字颜色
      bottomNavBackground: '#fff', // 底部标题栏背景颜色
      bottomNavColor: '#909090', // 底部标题栏文字颜色
      bottomNavActivationColor: '#80c7e8', // 底部导航栏激活的颜色
      activationColor: '#80c7e8', // 元素处于激活状态的颜色（需要讨论）
      alertBackground: '#fff', // 弹窗背景颜色（不建议设置这个，弹窗应该和App外层一样是和主题不相关的，用素色表达） 未实现
      alertColor: '#909090', // 弹窗文字颜色（不建议设置这个，弹窗应该和App外层一样是和主题不相关的，用素色表达） 未实现
    },
    networkConfigType: ['AIR_LINK', 'SOFT_AP'], // 枚举 AIR_LINK SOFT_AP 未实现
    registerType: ['EMAIL', 'PHONE'], // EMAIL PHONE 未实现
    quickLogin: [
    ], // 第三方登录的key
    pushKey: {}, // 推送的相关key
    iosAppID: '123', // ios上架后的appID 用来跳转到appStore
    androidAppID: '123', // android的包名用来跳转到appStore
    umengID: '59829c6c4ad1567b5a000a32', // 友盟id
  },

  // 机智云相关配置
  gizwits: {
    iosAppID: '560cda46ef1249e698191eccda1692f7',
    iosAppSecret: '36b83e78cfce4a93897e56447680075b',
    androidAppID: '0aeb1406bf7c441cbd15ceb9dfe934b9',
    androidAppSecret: '808599db2a8143c89ebd4f084a34fa56',
    smsResendTimeGap: 60, // 注册验证码，发送间隔。单位：秒
    serverHost: 'http://127.0.0.1:8080', // 后台服务的访问地址及端口
    openApiUrl: 'https://api.gizwits.com/', // openApi地址
  },

  // 关于我们页面
  aboutUs: {
    name: '九恒插座',
    background: null, // 暂时只支持颜色
    content: [
      // 和帮助一样图文并排
      {
        type: 'string',
        value: '机智云是广州机智云物联网科技有限公司旗下品牌，物联网开发及云服务平台，2014年上线智能硬件自助开发(PaaS)及云服务(SaaS)平台。机智云拥有完整的技术研发、安全和人工智能团队，为有志于进军物联网的开发者和企业提供安全。。。',
      },
      {
        type: 'image',
        value: 'http://obo7gtx2x.bkt.clouddn.com/04B5E799-2C1C-4FB4-8C9A-56BD812FDF6E.png',
      },
      {
        type: 'string',
        value: '机智云是广州机智云物联网科技有限公司旗下品牌，物联网开发及云服务平台，2014年上线智能硬件自助开发(PaaS)及云服务(SaaS)平台。机智云拥有完整的技术研发、安全和人工智能团队，为有志于进军物联网的开发者和企业提供安全。。。',
      },
      {
        type: 'image',
        value: 'http://obo7gtx2x.bkt.clouddn.com/04B5E799-2C1C-4FB4-8C9A-56BD812FDF6E.png',
      },
    ],
  },

  voiceTips: {},

  // 帮助说明
  // voiceTips: {
  //   googleHome: {
  //     data: [
  //       {
  //         title: '第一步：添加设备',
  //         text: [
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //         ],
  //       },
  //       {
  //         title: '第二步：添加设备',
  //         text: [
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //         ],
  //       },
  //       {
  //         title: '第三步：添加设备',
  //         text: [
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //         ],
  //       },
  //     ],
  //   },
  //   echo: {
  //     data: [
  //       {
  //         title: '第一步：添加设备',
  //         text: [
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //         ],
  //       },
  //       {
  //         title: '第二步：添加设备',
  //         text: [
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //         ],
  //       },
  //       {
  //         title: '第三步：添加设备',
  //         text: [
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //         ],
  //       },
  //       {
  //         title: '第三步：添加设备',
  //         text: [
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //         ],
  //       },
  //       {
  //         title: '第三步：添加设备',
  //         text: [
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //           '确保设备列表中有支持Google Home的设备确保设备列表中有支持Google',
  //         ],
  //       },
  //     ],
  //   },
  // },

  // 帮助页面的配置
  help: {
    content: [
      // 一个item代表一个分类，下面这个是配网相关的问题
      {
        id: 'content-1',
        title: '配网相关问题',
        content: [
          // 配网相关下的某一个帮助文档
          {
            id: 'sub-content-1',
            title: '配网失败',
            value: [
              // 文档由文字和图片组成，ui由超级app决定，如果让用户自己上传html的话，一个是开发成本，第二个是无法把控样式
              {
                type: 'string',
                value: '配网失败的原因可能是。配网失败的原因可能是。配网失败的原因可能是。',
              },
              {
                type: 'image',
                value: 'http://obo7gtx2x.bkt.clouddn.com/04B5E799-2C1C-4FB4-8C9A-56BD812FDF6E.png',
              },
              {
                type: 'string',
                value: '配网失败的原因可能是。配网失败的原因可能是。配网失败的原因可能是。',
              },
              {
                type: 'image',
                value: 'http://obo7gtx2x.bkt.clouddn.com/04B5E799-2C1C-4FB4-8C9A-56BD812FDF6E.png',
              },
            ],
          },
          {
            id: 'sub-content-1',
            title: '控制失败',
            value: [
              // 文档由文字和图片组成，ui由超级app决定，如果让用户自己上传html的话，一个是开发成本，第二个是无法把控样式
              {
                type: 'string',
                value: '配网失败的原因可能是。配网失败的原因可能是。配网失败的原因可能是。',
              },
              {
                type: 'image',
                value: 'http://obo7gtx2x.bkt.clouddn.com/04B5E799-2C1C-4FB4-8C9A-56BD812FDF6E.png',
              },
              {
                type: 'string',
                value: '配网失败的原因可能是。配网失败的原因可能是。配网失败的原因可能是。',
              },
              {
                type: 'image',
                value: 'http://obo7gtx2x.bkt.clouddn.com/04B5E799-2C1C-4FB4-8C9A-56BD812FDF6E.png',
              },
            ],
          },
        ],
      },
    ],
  },

  languages: [],
};

Object.assign(baseConfig.app, config.app);
Object.assign(baseConfig.gizwits, config.gizwits);
Object.assign(baseConfig.aboutUs, config.aboutUs);
Object.assign(baseConfig.help, config.help);
Object.assign(baseConfig.voiceTips, config.voiceTips);
Object.assign(baseConfig.languages, config.languages);

export default baseConfig;
