function parseValue(value) {
  value = parseInt(value);
  if (value < 0) value = 0;
  value = value.toString(16);
  // 补够4位
  let newValue = value;
  for (let i = 0; i < 4 - value.length; i++) {
    newValue = `0${newValue}`;
  }
  const string = [];
  for (let i = 0; i < newValue.length; i += 2) {
    string.push(parseInt(`${newValue[i]}${newValue[i + 1]}`, 16));
  }
  return new Array(2 - string.length).fill(0).concat(string);
}

function FToC(f) {
  console.log('FToC', f);
  f /= 10;
  return ((f - 32) / 1.8).toFixed(1) * 10;
}

function CToF(c) {
  console.log('CToF', c);
  c /= 10;
  console.log('CToFValue', ((c * 1.8) + 32).toFixed(1) * 10);
  return ((c * 1.8) + 32).toFixed(1) * 10;
}

function conversionDataPoint(dataPoint) {
  // 判断上报的数据是否是摄氏度，是摄氏度的话做个转换
  if (dataPoint.Unit_Flag === false) {
    // 华氏度转换成摄氏度
    if (dataPoint.Settemp_Para !== undefined) {
      dataPoint.Settemp_Para = FToC(dataPoint.Settemp_Para);
    }
    if (dataPoint.Currtemp_Para !== undefined) {
      dataPoint.Currtemp_Para = FToC(dataPoint.Currtemp_Para);
    }
    if (dataPoint.Cook_Para !== undefined) {
      for (let i = 0; i <= 4; i++) {
        const baseIndex = (i * 4);
        let value = `${dataPoint.Cook_Para[baseIndex].toString(16)}${dataPoint.Cook_Para[baseIndex + 1].toString(16)}'`;
        value = parseInt(value, 16);
        value = FToC(value);
        value = parseValue(value);
        dataPoint.Cook_Para.splice(baseIndex, 2, ...value);
      }
    }
  }
  return dataPoint;
}

function conversionDataPointCToF(dataPoint) {
  console.log('conversionDataPointCToF', dataPoint);
  if (dataPoint.Settemp_Para !== undefined) {
    dataPoint.Settemp_Para = CToF(dataPoint.Settemp_Para);
    console.log('dataPoint.Settemp_Para', dataPoint.Settemp_Para);
  }
  if (dataPoint.Currtemp_Para !== undefined) {
    dataPoint.Currtemp_Para = CToF(dataPoint.Currtemp_Para);
  }
  if (dataPoint.Cook_Para !== undefined) {
    for (let i = 0; i <= 4; i++) {
      const baseIndex = (i * 4);
      let value = `${dataPoint.Cook_Para[baseIndex].toString(16)}${dataPoint.Cook_Para[baseIndex + 1].toString(16)}`;
      value = parseInt(value, 16);
      value = CToF(value);
      value = parseValue(value);
      dataPoint.Cook_Para.splice(baseIndex, 2, ...value);
    }
  }
  return dataPoint;
}

export { conversionDataPoint, conversionDataPointCToF };
