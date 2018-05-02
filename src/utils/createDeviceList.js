const findDeviceForDid = (list, did) => {
  let device = {};
  list.map((item) => {
    if (item.did === did) {
      device = item;
    }
  });
  return device;
};

const createDeviceList = (deviceList, shareList) => {
  console.log(shareList);
  shareList.map((item) => {
    // 过滤deviceList找出分享过来的设备
    deviceList.map((deviceItem, deviceIndex) => {
      if (item.did === deviceItem.did) {
        // 是分享过来的设备
        deviceList[deviceIndex].isShare = true;
      }
    });
  });
  // groupList.map((item, index) => {
  //   // 类型是group
  //   groupList[index].type = 'group';
  //   groupList[index].name = groupList[index].group_name;
  //   let onlineStatusIndex = 0;
  //   item.devices.map((item) => {
  //     const device = findDeviceForDid(deviceList, item.did);
  //     if (device.onlineStatus === true) onlineStatusIndex++;
  //   });
  //   groupList[index].onlineStatus = onlineStatusIndex > 0 ? true : false;
  //   groupList[index].netStatus = onlineStatusIndex > 0 ? 2 : 0;
  // });
  const newList = [];
  // groupList.map((item) => {
  //   newList.push(item);
  // });
  deviceList.map((item) => {
    newList.push(item);
  });
  return newList;
};

export default createDeviceList;
