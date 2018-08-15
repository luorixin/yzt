// pages/uploadPic/idCard.js
import { Promise } from '../../utils/util';
import _Promise from '../../utils/promise.js';
import upng from '../../helpers/upng-js/UPNG.js'

const App = getApp()

const APP_ID = "11679748";
const API_KEY = "3dKHWG2RFSXFxFtptZnABI65";
const SECRET_KEY = "9m0YAjjAzn7jAPzXasPbQmLnE6SROKBk";

const TOKEN_API = 'https://aip.baidubce.com/oauth/2.0/token'
const IDCARD_API = 'https://aip.baidubce.com/rest/2.0/ocr/v1/idcard'
const OCR_API = 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic'

const canvasID = 'scannerCanvas'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    idcard_back:'../../src/image/idcard_back.png',
    idcard_tip: '../../src/image/idcard_tip.png',
    idcard_face:'../../src/image/idcard_face.png',
    idcard_img:'../../src/image/idcard_back.png',
    baidu_ai:{
      'access_token':'',
      'duetime':0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'access_token',
      success: function(res) {
        that.setData({
          baidu_ai:{
            'access_token': res.data,
            'duetime':that.data.baidu_ai.duetime
          }
        })
      },
    })
    wx.getStorage({
      key: 'duetime',
      success: function (res) {
        that.setData({
          baidu_ai: {
            'access_token': that.data.baidu_ai.access_token,
            'duetime': res.data,
          }
        })
      },
    })
  },

  /**
   * 选择图片
   */
  chooseIdCard: function(){
    let that = this;
    wx.chooseImage({
      count: 1,
      // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(e) {
        console.log(e.tempFilePaths[0])
        if (that.data.idcard_img != '../../src/image/idcard_face.png'){
          that.setData({
            idcard_back: e.tempFilePaths[0],
            idcard_img: e.tempFilePaths[0],
          })
        }else{
          that.setData({
            idcard_face: e.tempFilePaths[0],
            idcard_img: e.tempFilePaths[0],
          })
        }
        
        wx.showToast({
          title: '数据加载中',
          icon: 'loading',
          duration: 2000
        });
      },
    })
  },

  /**
   * 提交
   */
  formSubmit: function (e) {
    let that = this;
    console.log(that.data)
    if (that.data.idcard_back == '../../src/image/idcard_back.png' || that.data.idcard_face == '../../src/image/idcard_face.png') {
      //背面选择完成
      if (that.data.idcard_back != '../../src/image/idcard_back.png'){
        that.setData({
          idcard_img: that.data.idcard_face
        })
      }else{
        wx.showModal({
          title: '友情提示',
          content: '请先上传身份证',
          showCancel:false
        })
      }
    }else{
      //上传
      
      //解析
      //获取token
      let nowtime = new Date().getTime();
      if (that.data.baidu_ai.duetime < nowtime){
        wx.request({
          url: TOKEN_API,
          data:{
            grant_type:'client_credentials',
            client_id: API_KEY,
            client_secret:SECRET_KEY
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            let duetime = new Date().getTime()+res.data.expires_in;
            that.setData({
              baidu_ai: {
                'access_token': res.data.access_token,
                'duetime': duetime
              }
            })
            wx.setStorage({
              key: 'access_token',
              data: res.data.access_token,
            })
            wx.setStorage({
              key: 'duetime',
              data: duetime,
            })
            that._getImgSize(that.data.idcard_back)
              .then((res) => {
                console.log(res)
                return that._base64convert(res);
              })
              .then((res) => {
                return that._ocr(res)
              })
              .then((res) => {
                return that._getImgSize(that.data.idcard_face)
              })
              .then((res) => {
                console.log(res)
                return that._base64convert(res);
              })
              .then((res) => {
                return that._ocr(res)
              })
              .then((res) => {
                wx.redirectTo({
                  url: '../uploadPic/business/licence',
                })
              })
          }
        })
      }else{
        // let ocr_back = new _Promise((resolve,reject)=>{
        //   that._ocr(that.data.idcard_back, resolve, reject);
        // })
        // let ocr_face = new _Promise((resolve, reject) => {
        //   that._ocr(that.data.idcard_face, resolve, reject);
        // })
        // _Promise.all([ocr_back,ocr_face]).then(function(res){
        //   console.log(res);
        // })
        that._getImgSize(that.data.idcard_back)
          .then((res) => {
            console.log(res)
            return that._base64convert(res);
          })
          .then((res) => {
            console.log(res)
            return that._ocr(res)
          })
          .then((res) => {
            return that._getImgSize(that.data.idcard_face)
          })
          .then((res) => {
            return that._base64convert(res);
          })
          .then((res) => {
            return that._ocr(res)
          })
          .then((res) => {
            wx.redirectTo({
              url: '../uploadPic/business/licence',
            })
          })
      }
     
    }

  },
  //OCR识别
  _ocr: function (base64Img){
    let that = this;
    //识别
    return new _Promise((resolve, reject) => {
      console.log("token: " + that.data.baidu_ai.access_token);
      wx.request({
        url: OCR_API + "?access_token=" + that.data.baidu_ai.access_token,
        data: {
          image: base64Img,
          language_type: 'CHN_ENG'
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          console.log(res);
          resolve(res);
        },
        fail: function (res) {
          console.log(res)
          reject(res)
        }
      })
    })   
  },
  //获取图片尺寸
  _getImgSize: function (imgPath){
    let that = this;
    return new _Promise((resolve,reject)=>{
      wx.getImageInfo({
        src: imgPath,
        success:function(res){
          let imgWidth = res.width
          let imgHeight = res.height
          res.imgPath = imgPath;
          resolve(res);
        }
      })
    })
  },
  //转换base64
  _base64convert: function(res){
    let that = this;
    let { imgPath, width, height} = res;
    return new _Promise((resolve,reject)=>{
      let canvas = wx.createCanvasContext(canvasID)
      // 1. 绘制图片至canvas
      canvas.drawImage(imgPath, 0, 0, width, height)
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
            console.log(base64)
            resolve(base64);
          }
        })
      })
    })
  }
})