const getUnitText = (unit) => {
  // true是华氏度
  if (unit) {
    return '℉';
  }
  return '℃';
};
const getScale = (unit) => {
  if (unit) {
    return { min: 320, max: 2110 };
  }
  return { min: 0, max: 990 };
};

export { getUnitText, getScale };
