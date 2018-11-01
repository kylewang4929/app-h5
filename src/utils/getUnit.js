const getUnitText = (unit) => {
  // true是华氏度
  if (unit) {
    return '℉';
  }
  return '℃';
};
const getScale = (unit) => {
  if (unit) {
    return { min: 32, max: 211 };
  }
  return { min: 0, max: 99 };
};

export { getUnitText, getScale };
