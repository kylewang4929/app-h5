import moment from 'moment';

function collatingData(list) {
  const newObject = {};
  console.log('list', list);
  list.map((item) => {
    const remark = JSON.parse(item.originalData.remark);
    if (newObject[remark.id]) {
      newObject[remark.id].data.push(item);
    } else {
      // 新建一个
      newObject[remark.id] = {
        // 原本的定时模块遵循的是这个名字 有问题 要改的
        timeText: remark.name,
        id: remark.id,
        repeatText: item.repeatText,
        repeat: item.repeat,
        isActive: item.isActive,
        data: [item],
        attrs: item.attrs,
      };
    }
  });

  const newList = [];
  for (const key in newObject) {
    newList.push(newObject[key]);
  }
  console.log('newList', newList);
  return newList;
}

// 过滤出应该设置的防冻温度
/**
 * 逻辑
 * 1、记录当前时间，比如周二 10:00
2、从云端获取设备定时任务列表，筛选出与当前周相同的任务
3、按时间排序，从0:00-24:00，创建定时任务时间相同的就按温度排序，从高温到低温
4、取当前时间的前一个时间温度值下发温度命令，如果时间相同，则去最低温度值下发，同时把定时任务全部打开

比如：

设定定时任务

7:00-8:00 10℃
8:00-9:00 15℃
8:30-9:30 20℃
9:30-10:00 22℃
9:30-11:00 23℃
9:30-11:30 16℃
13:00-14:00 25℃


7:30 下发10℃
8:10 下发15℃
8:45 下发20℃
9:40 下发16℃(9:30分有三个，取最低温度)
12:00 下发10℃（12:00不属于任何时段，则取11:30分设置的防冻温度值）
13:30 下发25℃
15:00 下发10℃（15:00不属于任何时段，则取14:00分设置的防冻温度值）
 */
function filterAntifreeze (list, attr) {
  // 获取当前时间
  const date = moment();
  let currentWeekday = date.weekday();
  // 周日是第一天
  currentWeekday = currentWeekday % 7;
  const currentHour = date.hour();

  const schedulerList = [];
  // 过滤出当天的定时
  list.map((item) => {
    if (item.repeat[currentWeekday].active) {
      const remark = JSON.parse(item.originalData.remark);
      // 是当天的预约
      const { id } = item;
      // 查找另一个定时
      list.map((subItem) => {
        if (subItem.id !== id) {
          const subRemark = JSON.parse(subItem.originalData.remark);
          if (subRemark.gid === remark.gid) {
            // 同一组
            let startItem = {};
            let endItem = {};
            if (remark.type === 'start') {
              startItem = item;
              endItem = subItem;
            } else {
              startItem = subItem;
              endItem = item;
            }
            let isRepetition = false;
            schedulerList.map((groupItem) => {
              console.log('groupItem', groupItem);
              const itemRemark = JSON.parse(groupItem.start.originalData.remark);
              if (subRemark.gid === itemRemark.gid) {
                isRepetition = true;
              }
            });
            if (isRepetition === false) {
              schedulerList.push({
                start: startItem,
                end: endItem,
              });
            }
          }
        }
      });
    }
  });

  console.log('schedulerList', schedulerList);
  // 下一步匹配时间
  const time = (moment().hour() * 60) + moment().minute();
  const targetList = [];
  schedulerList.map((item) => {
    const startTime = (item.start.time.hours * 60) + item.start.time.min;
    const endTime = (item.end.time.hours * 60) + item.end.time.min;
    if (time >= startTime && time <= endTime) {
      targetList.push(item);
    }
  });

  let temp = null;
  if (targetList.length > 1) {
    // 找出温度最小的那个
    temp = targetList[0].start.attrs[attr];
    targetList.map((item) => {
      if (item.start.attrs[attr] < temp) {
        temp = item.start.attrs[attr];
      }
    });
  } else if (targetList.length === 1) {
    // 第一个就是
    temp = targetList[0].start.attrs[attr];
  } else {
    // 没有匹配，则默认
  }
  return temp;
}

export { collatingData, filterAntifreeze };
