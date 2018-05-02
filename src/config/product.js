// const socket = require('../assets/socket_on.png');
// const socketConfig = require('../assets/g_adddevice_lighting.png');
// const socketActiveConfig = require('../assets/g_adddevice_light.png');
// const light = require('../assets/bulb_on.png');
const productJson = require('./product_ext.json');

// const images = {
//   socket: {
//     icon: socket,
//     config: socketConfig,
//     activeConfig: socketActiveConfig,
//   },
//   light: {
//     icon: light,
//     config: socketConfig,
//     activeConfig: socketActiveConfig,
//   },
// };


productJson.map((item) => {
  item.icon = `./static/${item.productKey}/device_icon.png`;
  item.configImage = {
    active: `./static/${item.productKey}/config_wifi_on.png`,
    unActive: `./static/${item.productKey}/config_wifi_off.png`,
  };
});
const config = productJson;

// const config = [
//   {
//     categoryId: 'socket', // 品类ID
//     name: '插座', // 品类名称
//     productKey: '0ed76edb4d584cc5af8d6f4b7e75ca24', // pk
//     productSecret: 'a06c8b3f3ce446f993a6ee7d3b0ee153', // pk secret
//     templateId: 'superapp-template-socket1',
//     templateVersion: '1.0.0',
//     icon: socket, // 这个品类的icon
//     configImage: {
//       active: socketConfig, // 提示快闪和慢闪时的icon
//       unActive: socketActiveConfig,
//     },
//     softAPSSIDPrefix: 'XPG-GAgent-', // softAp 模式的前缀
//     moduleType: [4], // 4 = 汉枫 模块类型
//     airLink: { // 计划用来存放airLink配网时的步骤提示文字
//     },
//     softAp: { // 计划用来存放softAp配网时的步骤提示文字
//     },
//   },
//   {
//     categoryId: 'light', // 品类ID
//     name: '球泡灯', // 品类名称
//     productKey: 'd3fbd4265c7c47768b4f1788f328166a', // pk
//     productSecret: 'b0184807ca844fdea641375fc493be4d', // pk secret
//     templateId: 'superapp-template-light1',
//     templateVersion: '1.0.0',
//     icon: light, // 这个品类的icon
//     configImage: {
//       active: socketConfig, // 提示快闪和慢闪时的icon
//       unActive: socketActiveConfig,
//     },
//     softAPSSIDPrefix: 'XPG-GAgent-', // softAp 模式的前缀
//     moduleType: [4], // 4 = 汉枫 模块类型
//     airLink: { // 计划用来存放airLink配网时的步骤提示文字
//     },
//     softAp: { // 计划用来存放softAp配网时的步骤提示文字
//     },
//   },
// ];
export default config;
