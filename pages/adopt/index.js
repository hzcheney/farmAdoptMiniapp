// pages/adopt/adopt.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    categories: ["A区", "B区", "C区", "D区", "E区", "F区"],
    imgURLs: [],
    currentAnimals: [
      {
        _id: "WfmjMkYt3Wqd9FEV6IbdzQjd6obEr4u4lLjAPmDie05fKQI9",
        lifeSpan: 3,
        category: 0,
        num: 789,
        tag: "热门",
        price: 88,
        desc: "土生土长家禽欢迎认养",
        title: "土鸡",
        thumb:
          "https://6164-adopt-farm-9gc9w-1301918417.tcb.qcloud.la/chicken.jpg?sign=7e988857624cb06d8a86660df7b5d48c&t=1587562744",
      },
      {
        _id: "l4A7Zz8diZrYnAjYwG8a9xOd6GAmIuTe9DF6NosRdr0HBPaY",
        lifeSpan: 6,
        category: 0,
        num: 345,
        tag: "热门",
        price: 99,
        desc: "土生土长家禽欢迎认养",
        title: "白鹅",
        thumb:
          "https://6164-adopt-farm-9gc9w-1301918417.tcb.qcloud.la/baie.jpg?sign=754c45570ddb692960409a1178d37f46&t=1587562774",
      },
    ],
    activeKey: 0,
    allAnimals: [],
  },
  onChange(e) {
    // debugger;

    let activeKey = e.detail;
    this.setData({
      activeKey: activeKey,
    });
    let currentAnimals = [];
    let all = this.data.allAnimals;
    for (let index = 0; index < all.length; index++) {
      if (all[index].category === this.data.activeKey) {
        let item = all[index];
        currentAnimals.push(item);
      }
    }
    this.setData({
      currentAnimals: currentAnimals,
    });
  },
  toDetail: function (e) {
    wx.navigateTo({
      url: "/pages/adopt/adopt-detail?id=" + e.currentTarget.dataset.id,
    });
    console.log(e);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let imageUrls = [];
    wx.showLoading({
      title: "加载中",
    });
    const db = wx.cloud.database();
    db.collection("animal").get({
      success: function (res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        wx.hideLoading();
        console.log(res.data);
        that.setData({
          allAnimals: res.data,
        });
        for (let index = 0; index < res.data.length; index++) {
          let item = res.data[index].thumb;
          imageUrls.push(item);
        }
        // 异步真的是个大坑！
        that.downloadImages(imageUrls);
        that.addImage(imageUrls);
      },
      error: console.error,
    });
  },
  initData() {
    console.log("this is init data");
    let currentAnimals = [];
    let all = this.data.allAnimals;
    for (let index = 0; index < all.length; index++) {
      if (all[index].category === this.data.activeKey) {
        let item = all[index];
        currentAnimals.push(item);
      }
    }
    this.setData({
      currentAnimals: currentAnimals,
    });
  },
  // 从小程序云存储获取临时图片地址
  downloadImages: function (image_urls) {
    var that = this;
    if (image_urls.length === 0) {
      that.setData({
        imgURLs: [],
      });
    } else {
      var urls = [];
      for (let i = 0; i < image_urls.length; i++) {
        wx.cloud.downloadFile({
          fileID: image_urls[i],
          success: (res) => {
            // get temp file path
            // console.log(res.tempFilePath);
            urls.push(res.tempFilePath);
            if (urls.length == image_urls.length) {
              // console.log(urls);
              that.setData({
                imgURLs: urls,
              });
            }
          },
          fail: (err) => {
            console.log(err);
            // handle error
          },
        });
      }
    }
  },
  addImage: function (image_urls, callback) {
    for (let index = 0; index < image_urls.length; index++) {
      let element = image_urls[index];
      this.setData({
        "this.allAnimals[index].thumb": element,
      });
    }
    callback();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
