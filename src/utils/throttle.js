/**
 * 简版函数调用节流
 * @param  {Function} fn   需求节流的函数
 * @param  {Integer}  wait 多少秒执行一次，单位ms
 * @return {Function}
 */
export default function throttle(fn, wait) {
  let prev = null;
  return (...args) => {
    const now = new Date().getTime();
    !prev && (prev = now);
    const remaining = wait - (now - prev);
    if (remaining <= 0 || remaining === wait) {
      prev = now;
      return fn.apply(null, args);
    }
  }
}