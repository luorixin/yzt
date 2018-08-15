import _Promise from 'bluebird';

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const trim = str =>{
  return str.replace(/(^\s*)|(\s*$)/g, "")
}

/**
 * 封装Promise
 *
 * @param {Function} fn 网络接口
 * @param {Object} options 接口参数
 *
 * @return {Promise} Promise对象
 */
function Promise(fn, options) {
    options = options || {};

    return new _Promise((resolve, reject) => {
        if (typeof fn !== 'function') {
            reject();
        }

        options.success = resolve;
        options.fail = reject;
        fn(options);
    });
}

module.exports = {
  formatTime: formatTime,
  trim:trim,
  Promise: Promise,
}
