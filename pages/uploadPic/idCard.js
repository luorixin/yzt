// pages/uploadPic/idCard.js
import ImgToBasePlugin from '../../helpers/ImgToBasePlugin.js'
import OcrPlugin from '../../helpers/OcrPlugin.js'
import util from '../../utils/util.js'
import config from '../../utils/config.js'

const App = getApp()

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
    hasChooseBack:false,
    hasChooseFace:false,
    changeToFace:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me = this;
    me.loanPerson = App.HttpResource('/loanPerson/:id', { id: '@id' })
    me.initData();
  },

  initData: function(){
    let loanPersonId = wx.getStorageSync('loanPersonId');
    let me = this;
    me.loanPerson.getAsync({ id: loanPersonId })
      .then(data => {
        console.log(data)
        if (data.meta.code == 0) {
          let back = data.data.id_card_pic_back ? (config.fileBasePath + '/'+data.data.id_card_pic_back) : '../../src/image/idcard_back.png'
          let front = data.data.id_card_pic_front ? (config.fileBasePath + '/' + data.data.id_card_pic_front) : '../../src/image/idcard_face.png'
          me.setData({
            idcard_back: back,
            idcard_face: front,
            idcard_img: back,
          })
        }
      })
      .catch(err => console.log(err))
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
        if (!that.data.changeToFace){
          that.setData({
            idcard_back: e.tempFilePaths[0],
            idcard_img: e.tempFilePaths[0],
            hasChooseBack:true,
          })
        }else{
          that.setData({
            idcard_face: e.tempFilePaths[0],
            idcard_img: e.tempFilePaths[0],
            hasChooseFace:true
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
    if (!that.data.changeToFace) {
      //背面选择完成
      if (that.data.idcard_back != '../../src/image/idcard_back.png'){
        // 解析背面(微信小程序内部利用canvas进行解析)
        // new ImgToBasePlugin(that.data.idcard_back, canvasID, 'back', 'idcard')
        //   .on('DecodeComplete', (res) => {
        //     console.log(res)
        //     if (res.code == 0) {
        //       console.log(res.data)
        //       let formatRes = res.data;
        //       wx.setStorageSync('personInfo', {
        //         'end_date': formatRes.end_date,
        //         'start_data': formatRes.start_data,
        //         'partement': formatRes.partement,
        //       })
        //       //如果之前已经上传过的，且本次没有重新选择，则跳过上传过程
        //       if (!that.data.hasChooseBack) {
        //         that.setData({
        //           idcard_img: that.data.idcard_face,
        //           changeToFace: true
        //         })
        //       }else{
        //         //上传
        //         let formData = {
        //           model: 'loanPerson',
        //           model_id: wx.getStorageSync('loanPersonId'),
        //           model_name: 'id_card_pic_back'
        //         }
        //         console.log(that.data.idcard_back, formData)
        //         util.uploadFile(that.data.idcard_back, formData)
        //         .then(function(res){
        //           console.log(res)
        //           that.setData({
        //             idcard_img: that.data.idcard_face,
        //             changeToFace: true
        //           })
        //         })
        //         .catch(function(res){
        //           wx.showModal({
        //             title: '友情提示',
        //             content: '上传发生错误，请重新上传',
        //             showCancel: false
        //           })
        //         })
        //       }
        //     } else {
        //       wx.showModal({
        //         title: '友情提示',
        //         content: '解析发生错误，请重新上传',
        //         showCancel: false
        //       })
        //     }
        //   })

        //如果之前已经上传过的，且本次没有重新选择，则跳过上传过程(调用远程api进行解析)
        if (!that.data.hasChooseBack) {
          util.ocrAnalysis('idcard', {
            image: 'public'+that.data.idcard_back.split(config.fileBasePath)[1],
            id_card_side: 'back',
          }).then(function(res){
            console.log(res)
            if (res.meta.code == 0) {
              let formatRes = OcrPlugin.formatResult['formatResult_idcard'](res)
              console.log(formatRes)
              if (formatRes) {
                wx.setStorageSync('personInfo', {
                  'end_date': formatRes.end_date,
                  'start_data': formatRes.start_data,
                  'partement': formatRes.partement,
                })
              }
              that.setData({
                idcard_img: that.data.idcard_face,
                changeToFace: true
              })
            }
          })
          .catch(function(res){
            console.log(res)
            wx.showModal({
              title: '友情提示',
              content: '解析发生错误，请重新上传',
              showCancel: false
            })
          })
        } else {
          //上传
          let formData = {
            model: 'loanPerson',
            model_id: wx.getStorageSync('loanPersonId'),
            model_name: 'id_card_pic_back'
          }
          console.log(that.data.idcard_back, formData)
          util.uploadFile(that.data.idcard_back, formData)
            .then(function (res) {
              res = JSON.parse(res)
              console.log(res)
              //解析图片
              return util.ocrAnalysis('idcard', {
                image: res.data.image,
                id_card_side:'back',
              })
            })
            .then(function(res){
              if (res.meta.code == 0) {
                console.log(res.data)
                let formatRes = OcrPlugin.formatResult['formatResult_idcard'](res)
                if (formatRes) {
                  wx.setStorageSync('personInfo', {
                    'end_date': formatRes.end_date,
                    'start_data': formatRes.start_data,
                    'partement': formatRes.partement,
                  })
                }
                that.setData({
                  idcard_img: that.data.idcard_face,
                  changeToFace: true
                })
              }
            })
            .catch(function (res) {
              wx.showModal({
                title: '友情提示',
                content: '上传或者解析发生错误，请重新上传',
                showCancel: false
              })
            })
        }
      }else{
        wx.showModal({
          title: '友情提示',
          content: '请先上传身份证',
          showCancel:false
        })
      }
    }else{
      //上传
      //解析正面
      // new ImgToBasePlugin(that.data.idcard_face, canvasID, 'front', 'idcard')
      //   .on('DecodeComplete', (res) => {
      //     if (res.code == 0) {
      //       console.log(res.data)
      //       let formatRes = res.data;
      //       let personInfo = wx.getStorageSync('personInfo') ? wx.getStorageSync('personInfo') : {};
      //       personInfo.address = formatRes.address;
      //       personInfo.card_id = formatRes.card_id;
      //       personInfo.birth = formatRes.birth;
      //       personInfo.name = formatRes.name;
      //       personInfo.gender = formatRes.gender;
      //       personInfo.nation = formatRes.nation;
      //       wx.setStorageSync('personInfo', personInfo)
      //       //如果之前已经上传过的，且本次没有重新选择，则跳过上传过程
      //       if (!that.data.hasChooseFace) {
      //         wx.navigateTo({
      //           url: '../uploadPic/business/licence',
      //         })
      //       }else{
      //         //上传
      //         let formData = {
      //           model: 'loanPerson',
      //           model_id: wx.getStorageSync('loanPersonId'),
      //           model_name: 'id_card_pic_front'
      //         }
      //         util.uploadFile(that.data.idcard_face, formData)
      //           .then(function (res) {
      //             console.log(res)
      //             wx.navigateTo({
      //               url: '../uploadPic/business/licence',
      //             })
      //           })
      //           .catch(function (res) {
      //             wx.showModal({
      //               title: '友情提示',
      //               content: '上传发生错误，请重新上传',
      //               showCancel: false
      //             })
      //           })
      //       }
            
      //     } else {
      //       wx.showModal({
      //         title: '友情提示',
      //         content: '解析发生错误，请重新上传',
      //         showCancel: false
      //       })
      //     }
      //   })
    
      //如果之前已经上传过的，且本次没有重新选择，则跳过上传过程(调用远程api进行解析)
      if (!that.data.hasChooseFace) {
        util.ocrAnalysis('idcard', {
          image: 'public' + that.data.idcard_face.split(config.fileBasePath)[1],
          id_card_side: 'front',
        }).then(function (res) {
          if (res.meta.code == 0) {
            console.log(res.data)
            let formatRes = OcrPlugin.formatResult['formatResult_idcard'](res)
            if (formatRes) {
              let personInfo = wx.getStorageSync('personInfo') ? wx.getStorageSync('personInfo') : {};
              personInfo.address = formatRes.address;
              personInfo.card_id = formatRes.card_id;
              personInfo.birth = formatRes.birth;
              personInfo.name = formatRes.name;
              personInfo.gender = formatRes.gender;
              personInfo.nation = formatRes.nation;
              wx.setStorageSync('personInfo', personInfo)
            }
            wx.navigateTo({
              url: '../uploadPic/business/licence',
            })
          }
        })
        .catch(function () {
          wx.showModal({
            title: '友情提示',
            content: '解析发生错误，请重新上传',
            showCancel: false
          })
        })
      } else {
        //上传
        let formData = {
          model: 'loanPerson',
          model_id: wx.getStorageSync('loanPersonId'),
          model_name: 'id_card_pic_front'
        }
        util.uploadFile(that.data.idcard_face, formData)
          .then(function (res) {
            res = JSON.parse(res)
            console.log(res)
            //解析图片
            return util.ocrAnalysis('idcard', {
              image: res.data.image,
              id_card_side: 'front',
            })
          })
          .then(function (res) {
            if (res.meta.code == 0) {
              console.log(res.data)
              let formatRes = OcrPlugin.formatResult['formatResult_idcard'](res)
              if (formatRes) {
                let personInfo = wx.getStorageSync('personInfo') ? wx.getStorageSync('personInfo') : {};
                personInfo.address = formatRes.address;
                personInfo.card_id = formatRes.card_id;
                personInfo.birth = formatRes.birth;
                personInfo.name = formatRes.name;
                personInfo.gender = formatRes.gender;
                personInfo.nation = formatRes.nation;
                wx.setStorageSync('personInfo', personInfo)
              }
              wx.navigateTo({
                url: '../uploadPic/business/licence',
              })
            }
          })
          .catch(function (res) {
            wx.showModal({
              title: '友情提示',
              content: '上传或者解析发生错误，请重新上传',
              showCancel: false
            })
          })
      }
    }
  },
  
  
})