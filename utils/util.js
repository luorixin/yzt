import _Promise from 'bluebird';
import config from './config.js'

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

/**
 * 上传文件
 */
function uploadFile(filePath,formData){
  return new _Promise((resolve, reject) => {
    wx.uploadFile({
      url: config.basePath + '/upload/file',
      filePath: filePath,
      name: 'file',
      formData: formData,
      header:{
        'Authorization': 'Bearer ' + wx.getStorageSync('token'),
      },
      success: function (res) {
        resolve(res.data)
      },
      fail: function(){
        reject({
          code: 3,
          reason: '文件上传失败'
        })
      }
    })
  });
}

/**
 * ocr解析
 */
function ocrAnalysis(type,data){
  return new _Promise((resolve, reject) => {
    wx.request({
      url: config.basePath + '/ocr/' + type,
      header: {
        'content-type': 'application/x-www-form-urlencoded' ,
        'Authorization': 'Bearer ' + wx.getStorageSync('token'),
      },
      method:'POST',
      data:data,
      success: function (res) {
        resolve(res.data)
      },
      fail: function () {
        reject({
          code: 3,
          reason: 'ocr接口调用失败'
        })
      }
    })
  });
}

module.exports = {
  formatTime: formatTime,
  trim:trim,
  Promise: Promise,
  uploadFile: uploadFile,
  ocrAnalysis: ocrAnalysis,
}
