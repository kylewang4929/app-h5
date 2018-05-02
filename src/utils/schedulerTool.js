import moment from 'moment';

export function filterUpcoming(list) {
  let timeText = -1;
  let timeStamp = 0;
  const nowDate = new Date();
  const week = nowDate.getUTCDay();
  const weekData = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  let activeItem = null;

  list.map((item, index) => {
    if (item.isActive) {
      // 判断是否是今天执行
      if (item.repeatText[0] == 'TODAY') {
        const timingDate = new Date();
        timingDate.setHours(item.time.hours);
        timingDate.setMinutes(item.time.min);

        if (timeStamp == 0) {
          timeStamp = timingDate.getTime();
        }
        if (timingDate.getTime() > nowDate.getTime() && timingDate.getTime() <= timeStamp) {
          timeText = item.timeText;
          activeItem = item;
        }
      } else {
        item.repeat.map((weekItem, weekIndex) => {
          if (weekItem.id == weekData[week] && weekItem.active) {
            //是今天
            const timingDate = new Date();
            timingDate.setHours(item.time.hours);
            timingDate.setMinutes(item.time.min);

            if (timeStamp == 0) {
              timeStamp = timingDate.getTime();
            }
            if (timingDate.getTime() > nowDate.getTime() && timingDate.getTime() <= timeStamp) {
              timeText = item.timeText;
              activeItem = item;
            }
          }
        });
      }
    }
  });
  if (timeText == -1) {
    return { timeText: '', activeItem: {} };
  } else {

    return { timeText, item: activeItem };
  }

}

// 传入utc时间，获取hours和min
export function getTime(time) {
  time = time.split(":");

  const date = new Date();

  date.setUTCHours(parseInt(time[0]));
  date.setUTCMinutes(parseInt(time[1]));

  let obj = {
    hours: date.getHours(),
    min: date.getMinutes()
  };
  return obj;
}

//传入utc时间，获取hours和min
export function getTimeAndData(dateTime, time) {
  time = time.split(":");
  dateTime = dateTime.split("-");

  const date = moment();
  date.hour(parseInt(time[0]));
  date.minute(parseInt(time[1]));
  date.year(parseInt(dateTime[0]));
  date.month(parseInt(dateTime[1]) - 1);
  date.date(parseInt(dateTime[2]));

  date.minute(date.minute() + date.utcOffset());

  let obj = {
    hours: date.hour(),
    min: date.minute(),
    date: date.year() + '-' + formattingNum(date.month() + 1) + '-' + formattingNum(date.date()),
  };
  return obj;
}

//传入repeat字符，输出repeat数组和repeatText
export function getRepeat(text, date) {
  let repeat = [
    {
      text: 'SUN',
      id: 'sun',
      active: false
    },
    {
      text: 'MON',
      id: 'mon',
      active: false
    }, {
      text: 'TUE',
      id: 'tue',
      active: false
    }, {
      text: 'WED',
      id: 'wed',
      active: false
    }, {
      text: 'THU',
      id: 'thu',
      active: false
    }, {
      text: 'FRI',
      id: 'fri',
      active: false
    }, {
      text: 'SAT',
      id: 'sat',
      active: false
    }
  ];
  if (text == 'none') {
    const bookingDate = new Date(date);
    const nowDate = new Date();
    const nowDateText = nowDate.getUTCFullYear() + '-' + formattingNum(nowDate.getUTCMonth() + 1) + '-' + formattingNum(nowDate.getUTCDate());

    let repeatText = [formattingNum(bookingDate.getMonth() + 1) + '-' + formattingNum(bookingDate.getDate())];

    if (nowDateText == date) {
      repeatText = ['TODAY'];
    }

    return { repeat, repeatText };
  } else {
    const originalRepeat = text.split(',');
    let repeatText = [];

    repeat.map((item, index) => {
      originalRepeat.map((subItem, subIndex) => {
        if (subItem == item.id) {
          item.active = true;
          repeatText.push(item.text);
        }
      });
    });

    if (originalRepeat.length >= 7) {
      repeatText = ['EVERY_DAY'];
    }
    if (originalRepeat.length == 5 && repeat[6].active == false && repeat[0].active == false) {
      repeatText = ['WORKING_DAYS'];
    }

    return { repeat, repeatText };
  }
}

//格式化数组，加个0
export function formattingNum(num) {
  return (Array(2).join(0) + num).slice(-2);
}

//从底层获取数据，并转换成我需要的格式
export function conversionBookingList(par) {
  //保存列表
  let newBookList = [];
  par.map((item, index) => {
    console.log('item', item);
    const { id, enabled, attrs, time, repeat, date } = item;

    let timeObj = {};
    if (repeat == 'none') {
      console.log('timeObj', date, time);
      timeObj = getTimeAndData(date, time);
    } else {
      timeObj = getTime(time);
    }

    const repeatObj = getRepeat(repeat, timeObj.date);

    let obj = {
      id,
      isActive: enabled,
      attrs,
      date: timeObj.date || '',
      time: { hours: timeObj.hours, min: timeObj.min },
      timeText: formattingNum(timeObj.hours) + ':' + formattingNum(timeObj.min),
      repeat: repeatObj.repeat,
      repeatText: repeatObj.repeatText,
      originalData: item
    };
    //这里需要做一个判断 如果是单次预约，并且已经过期的，需要设置成关闭
    if (repeat == 'none') {
      // date time
      let bookingTime = parseInt(moment(date + ' ' + time).format('x'));
      let nowDate = new Date();
      const offsetTime = nowDate.getTimezoneOffset();
      nowDate.setMinutes(nowDate.getMinutes() + offsetTime);
      let nowTime = nowDate.getTime();
      if (nowTime > bookingTime) {
        //已经过期
        obj.isActive = false;
        obj.originalData.enabled = false;
      }
    }

    newBookList.push(obj);
  });
  return newBookList;
}

//传入repeat数组 输出repeat字符串
export function conversionRepeat(repeat) {
  let repeatText = '';
  repeat.map((item, index) => {
    console.log(item);
    if (item.active) {
      repeatText += item.id + ',';
    }
  });

  if (repeatText == '') {
    repeatText = 'none';
  } else {
    repeatText = repeatText.substring(0, repeatText.length - 1);
  }

  return repeatText;
}

//本地时间转换成utc时间
export function localTimeToUtcTime(date, time) {
  const newDate = moment(`${date} ${formattingNum(time.hour)}:${formattingNum(time.min)}`, 'YYYY-MM-DD HH:mm');

  // newDate.hour(time.hour);
  // newDate.minute(time.min);
  newDate.utc();

  return {
    time: formattingNum(newDate.hour()) + ':' + formattingNum(newDate.minute()),
    date: newDate.year() + '-' + formattingNum(newDate.month() + 1) + '-' + formattingNum(newDate.date()),
  };
}

/**
 * 传入time {hour: '', min: ''} date 输出api需要的utc时间
 * @param {*} time 
 * @param {*} date 
 * @param {*} type 'single': 'cycle'
 */
export function conversionTimeAndDate(time, date, type) {
  if (type === 'single') {
    const nowDate = moment();
    // 如果date是空 那么设置为今天
    date = date == '' ? nowDate.get('year') + '-' + formattingNum((nowDate.get('month') + 1)) + '-' + formattingNum(nowDate.get('date')) : date;

    // 单次预约，先判断时间是否过期
    let setDate = moment(date + ' ' + formattingNum(time.hour) + ':' + formattingNum(time.min), 'YYYY-MM-DD HH:mm');
    if (nowDate.format('x') + (60 * 1000) > setDate.format('x')) {
      // 过期 时间向前加一天 先判断今天 还是过期就加一天
      const dateText = nowDate.get('year') + '-' + formattingNum((nowDate.get('month') + 1)) + '-' + formattingNum(nowDate.get('date'));
      setDate = moment(dateText + ' ' + formattingNum(time.hour) + ':' + formattingNum(time.min), 'YYYY-MM-DD HH:mm');
      setDate.hour(time.hour);
      setDate.minute(time.min);
      if (nowDate.format('x') > setDate.format('x') + (60 * 1000)) {
        // 还是过期
        setDate.date(setDate.get('date') + 1);
      } else {
        // 使用这个时间
      }

      setDate.utc();
      date = setDate.get('year') + '-' + formattingNum((setDate.get('month') + 1)) + '-' + formattingNum(setDate.get('date'));
      time = formattingNum(setDate.get('hour')) + ':' + formattingNum(setDate.get('minute'));
    } else {
      const timeData = localTimeToUtcTime(date, time);
      time = timeData.time;
      date = timeData.date;
    }
  } else {
    // 把time转换成utc时间
    const timeData = localTimeToUtcTime(moment().format('YYYY-MM-DD'), time);
    time = timeData.time;
    date = '';
  }
  return { time, date };
}

/**
 * 
 * @param {*list} 预约列表 
 * @param {*item} 要检查的item {attrs, date, time, repeat, enabled, did}
 */
export function checkIsConsistent(bookingList, bookingItem) {
  let isConsistent = false;
  const itemAttrs = JSON.stringify(bookingItem.attrs);
  bookingList.map((item, index) => {
    const data = item.originalData;
    const attrs = JSON.stringify(data.attrs);

    if (data.repeat == bookingItem.repeat &&
      data.time == bookingItem.time && data.date == bookingItem.date &&
      attrs == itemAttrs && bookingItem.id != data.id) {
      //所有数据都相同
      isConsistent = true;
    }
  });
  return isConsistent;
}
