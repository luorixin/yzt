import Promise from '../utils/promise.js'
import upng from '../helpers/upng-js/UPNG.js'

const APP_ID = "11679748";
const API_KEY = "3dKHWG2RFSXFxFtptZnABI65";
const SECRET_KEY = "9m0YAjjAzn7jAPzXasPbQmLnE6SROKBk";

const TOKEN_API = 'https://aip.baidubce.com/oauth/2.0/token'
const IDCARD_API = 'https://aip.baidubce.com/rest/2.0/ocr/v1/idcard'
const BASIC_API = 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic'

const URL = {
  'basic':BASIC_API,
  'idcard':IDCARD_API
}
/**
 * 根据图片转文字
 * 用百度api
 */
let request = (opts, callback) => {
  _getToken().then(function (token){
    let params = {
      image: opts.base64,
      id_card_side: opts.id_card_side,
      language_type: 'CHN_ENG',
      access_token: token
    }
    wx.request({
      url: URL[opts.api_type],
      data: params,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        let formatRes = _formatResult['_formatResult_' + opts.api_type](res)
        if (formatRes) {
          if (callback.success)
            callback.success(formatRes)
        } else {
          if (callback.fail)
            callback.fail()
        }
      },
      fail: function (res) {
        if (callback.fail)
          callback.fail()
      }
    })
  })
  
}

let _getToken = ()=>{
  return new Promise((resolve, reject) => {
    let access_token = wx.getStorageSync('access_token')
    let duetime = wx.getStorageSync('duetime')
    //获取token
    let nowtime = new Date().getTime();
    if (duetime < nowtime) {
      console.log("重新获取token")
      wx.request({
        url: TOKEN_API,
        data: {
          grant_type: 'client_credentials',
          client_id: API_KEY,
          client_secret: SECRET_KEY
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          let duetime = new Date().getTime() + res.data.expires_in;
          wx.setStorage({
            key: 'access_token',
            data: res.data.access_token,
          })
          wx.setStorage({
            key: 'duetime',
            data: duetime,
          })
          resolve(res.data.access_token)
        }
      })
    }else{
      resolve(access_token)
    }
  })
}

let _formatResult = {
  _formatResult_basic: function(res){
    return ''
  },
  _formatResult_idcard: function(res){
    let format = {}
    if (res.statusCode == 200) {
      if (res.data.words_result_num > 0) {
        let result = res.data.words_result;
        if (result['失效日期']) {
          format['end_date'] = result['失效日期'].words
        }
        if (result['签发日期']) {
          format['start_data'] = result['签发日期'].words
        }
        if (result['签发机关']) {
          format['partement'] = result['签发机关'].words
        }
        if (result['住址']) {
          format['address'] = result['住址'].words
        }
        if (result['公民身份号码']) {
          format['card_id'] = result['公民身份号码'].words
        }
        if (result['出生']) {
          format['birth'] = result['出生'].words
        }
        if (result['姓名']) {
          format['name'] = result['姓名'].words
        }
        if (result['性别']) {
          format['gender'] = result['性别'].words
        }
        if (result['民族']) {
          format['nation'] = result['民族'].words
        }
        return format;
      } else {
        return ''
      }
    } else {
      return "";
    }
  }
}

module.exports = {
  request: request
}