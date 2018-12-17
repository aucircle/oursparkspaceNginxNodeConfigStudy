var app = getApp();
/**
 * 时间格式化输出函数
 * 替换标识符:
 * M 月份
 * d 日
 * h 小时
 * m 分钟
 * s 秒
 * q 季度
 * S 毫秒
 * 
 * @method dataFtt
 * 
 * @param {String} fmt 目标格式化类型 
 * @param {Date} date 目标格式化的时间类
 * 
 * @return {String} 按照目标格式输出的日期格式
 */

function dateFtt(fmt, date) { //author: meizz
  var o = {
    "M+": date.getMonth() + 1,                 //月份   
    "d+": date.getDate(),                    //日   
    "h+": date.getHours(),                   //小时   
    "m+": date.getMinutes(),                 //分   
    "s+": date.getSeconds(),                 //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds()             //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
} 
Page({
  //data属性为和页面绑定的数据
  data: {
    but: "提交",
    input: "", //input输入框的值，用于更新记录成功后清空输入框的值
    record: "" //用于显示从云数据库读出来的值
  },
  /**
   * read方法
   * 用以绑定在 读取一条信息 按钮的 点击事件 上
   * 用以发起request 调用远程API
   * 将返回信息更新在 data.record 上
   */
  read() {
    wx.request({
      url: app.globalData.urlBase + '/theLastOne', // url
      success: res => { // 成功的回调方法
        console.log(res.data); // 输出调试信息
        if(res.data.code == 200){ // 判断返回信息是否合法
          this.setData({ // 更新视图层数据
            record: "成功读取一条信息:" + res.data.msg
          })
        }else{
          this.setData({
            record: "失败了,原因是:" + res.data.msg
          })
        }
      },
      fail: console.error // 失败回调方法 此处直接传入一个叫 console.error 的函数
    })
  },
  /**
   * readmore 方法
   * 用于 绑定在 读取多条 按钮的点击事件上
   * 用于调用远程API返回全部已经排序好的结果
   * 将结果格式化输出 并 更新在 data.record 上
   */
  readmore(){
    wx.request({
      url: app.globalData.urlBase + '/sortByMsg',
      success: res => {
        console.log(res.data);
        if (res.data.code == 200) {
          let out = "成功读取" + res.data.msg.length + "条信息";
          for(const msg of res.data.msg){ // 对数组内信息逐条进行格式化的处理
            out += "\n" + dateFtt("hh:mm:ss",new Date(msg.uploadDate))+ ":  " + msg.msg;
          }
          this.setData({record: out})
        } else {
          this.setData({
            record: "失败了,原因是:" + res.data.msg
          })
        }
      },
      fail: console.error
    })
  },
  /**
   * formSubmit方法
   * 用以绑定在 表单 的 submit 事件上
   * 用以发起提交
   * 具体文档在
   * https://developers.weixin.qq.com/miniprogram/dev/component/form.html?search-key=bindsubmit
   * @param {Object} e 表单数据对象
   */
  formSubmit(e) {
    wx.request({
      url: app.globalData.urlBase + '/addMsg',
      method: "POST", // 使用POST方法进行提交
      data:{
        msg: e.detail.value.msg
      },
      success: (rec)=>{
        console.log(rec.data);
        if(rec.data.code == 200) this.setData({but: "成功提交"});
        else this.setData({ but: "提交失败" })
      },
      fail: console.error,
    })
  },
  /**
   * getOpenId 方法
   * 用以绑定在 获取OpenId 按钮的点击事件上
   * 
   * 用以调用后台api 发起请求
   * 并将结果显示在 弹窗 里
   */
  getOpenId(){
    wx.login({ // 首先发起 登陆 
      //文档: https://developers.weixin.qq.com/miniprogram/dev/api/wx.login.html  
      success: res=>{ // 成功回调函数
        wx.request({ // 发起请求
          url: app.globalData.urlBase + '/newUser',
          method: "POST",
          data: {
            code: res.code // 传递code
          },
          success: (rec) => { // 请求成功回调函数
            console.log(rec.data);
            if (rec.data.code == 200) // 判断是否发生错误
              wx.showModal({ // 显示
                title: '成功获得openid\n'+rec.data.msg,
                content: '请后台查看'
              });
            else
              wx.showModal({
                title: '失败了,嘤嘤嘤',
                content: rec.data.msg
              })
          },
          fail: (err)=>{
            console.log(err);
            wx.showModal({
              title: '失败了,嘤嘤嘤',
              content: "我连不上服务器QAQ"
            })
          },
        })
      }
    })
  } // PS: 两层回调就括号已经很恐怖了
    // 看这个令人窒息的大括号,当然也可以使用别的方式提高代码可读性
    // 暂时可以使用的方式就是ES6的Promise了感兴趣的同学可以进行了解
})