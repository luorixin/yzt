import Promise from '../utils/promise.js';
import upng from '../helpers/upng-js/UPNG.js'
import ocr from '../helpers/OcrPlugin.js'


const actionTypes = ['ImageChanged', 'DecodeStart', 'DecodeComplete']

/**
 * 图片转文字相关类
 * 利用百度api
 */
export default class ImgToBasePlugin{
  constructor(imgPath, canvasId, id_card_side,api_type){
    this.imgPath = imgPath
    this.canvasId = canvasId
    this.id_card_side = id_card_side
    this.api_type = api_type
    this.__init();
  }
  __init(){
    let that = this;
    that._getImgSize(that.imgPath)
      .then((res) => {
        return that._base64convert(res);
      })
      .then((res) => {
        // console.log(res)
        return that._requestOCR(res)
      })
      .then(res => {
        that.onDecodeComplete && that.onDecodeComplete({
          code: 0,
          data: res
        })
      })
      .catch(error => {
        that.onDecodeComplete && that.onDecodeComplete(error)
      })
  }
  //生成回调方法
  on(action, callback) {
    if (actionTypes.indexOf(action) > -1 && typeof (callback) === 'function') {
      this['on' + action] = callback
    }
    return this
  }

  //OCR识别
  _requestOCR(base64) {
    let that = this;
    return new Promise((resolve, reject) => {
      ocr.request({
        base64:base64,
        id_card_side: that.id_card_side,
        api_type: that.api_type
      }, {
        success(res) {
          resolve(res)
        },
        fail() {
          reject({
            code: 3,
            reason: 'OCR解析失败'
          })
        }
      })
    })
  }
  //获取图片尺寸
  _getImgSize(imgPath) {
    let that = this;
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: imgPath,
        success: function (res) {
          let canvasWidth = 320
          let canvasHeight = 200
          res.imgPath = imgPath;
          //按比例缩放。
          let imgRatio = res.width / res.height
          let canvasRatio = canvasWidth / canvasHeight;
          if (imgRatio > canvasRatio) {
            res.width = canvasWidth
            res.height = parseInt(res.width / imgRatio)
            res.top = parseInt((canvasHeight - res.height) / 2)
            res.left = 0
          } else {
            res.height = canvasHeight
            res.width = parseInt(res.height * imgRatio)
            res.left = parseInt((canvasHeight - res.width) / 2)
            res.top = 0
          }
          resolve(res);
        }
      })
    })
  }
  //转换base64
  _base64convert(res) {
    let that = this;
    let { imgPath, width, height, left, top } = res;
    let canvasID = that.canvasId
    return new Promise((resolve, reject) => {
      let canvas = wx.createCanvasContext(canvasID)
      // 1. 绘制图片至canvas
      canvas.drawImage(imgPath, left, top, width, height)
      // 绘制完成后执行回调，API 1.7.0
      canvas.draw(false, () => {
        // 2. 获取图像数据， API 1.9.0
        wx.canvasGetImageData({
          canvasId: canvasID,
          x: 0,
          y: 0,
          width: width,
          height: height,
          success(res) {
            // 3. png编码
            console.log(res)
            let pngData = upng.encode([res.data.buffer], res.width, res.height)
            // 4. base64编码
            let base64 = wx.arrayBufferToBase64(pngData)
            // ...
            // console.log(base64)
            resolve(base64);
          }
        })
      })
    })
  }
}