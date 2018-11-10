function FToC(f) {
  return parseInt((f - 32) / 1.8);
}

function CToF(c) {
  return parseInt((c * 1.8) + 32);
}

function conversionDataPoint(dataPoint) {
  // 判断上报的数据是否是摄氏度，是摄氏度的话做个转换
  if (dataPoint.Unit_Flag === false) {
    // 华氏度转换成摄氏度
    if (dataPoint.Settemp_Para) {
      dataPoint.Settemp_Para = FToC(dataPoint.Settemp_Para);
    }
    if (dataPoint.Currtemp_Para) {
      dataPoint.Currtemp_Para = FToC(dataPoint.Currtemp_Para);
    }
    if (dataPoint.Cook_Para) {
      for (let i = 0; i <= 4; i++) {
        const baseIndex = (i * 4);
        let value = dataPoint.Cook_Para[baseIndex] + dataPoint.Cook_Para[baseIndex + 1];
        value = FToC(value);
        if (value > 255) {
          dataPoint.Cook_Para[baseIndex] = value - 255;
          dataPoint.Cook_Para[baseIndex + 1] = 255;
        } else {
          dataPoint.Cook_Para[baseIndex] = 0;
          dataPoint.Cook_Para[baseIndex + 1] = value;
        }
      }
    }
  }
  return dataPoint;
}

function conversionDataPointCToF(dataPoint) {
  if (dataPoint.Settemp_Para) {
    dataPoint.Settemp_Para = CToF(dataPoint.Settemp_Para);
  }
  if (dataPoint.Currtemp_Para) {
    dataPoint.Currtemp_Para = CToF(dataPoint.Currtemp_Para);
  }
  if (dataPoint.Cook_Para) {
    for (let i = 0; i <= 4; i++) {
      const baseIndex = (i * 4);
      let value = dataPoint.Cook_Para[baseIndex] + dataPoint.Cook_Para[baseIndex + 1];
      value = CToF(value);
      if (value > 255) {
        dataPoint.Cook_Para[baseIndex] = value - 255;
        dataPoint.Cook_Para[baseIndex + 1] = 255;
      } else {
        dataPoint.Cook_Para[baseIndex] = 0;
        dataPoint.Cook_Para[baseIndex + 1] = value;
      }
    }
  }
  return dataPoint;
}

export { conversionDataPoint, conversionDataPointCToF };
