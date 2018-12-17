var app = getApp();
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
  //read函数，点击读取按钮触发此函数
  read() {
    wx.request({
      url: app.globalData.urlBase + '/theLastOne',
      success: res => {
        console.log(res.data);
        if(res.data.code == 200){
          this.setData({
            record: "成功读取一条信息:" + res.data.msg
          })
        }else{
          this.setData({
            record: "失败了,原因是:" + res.data.msg
          })
        }
      },
      fail: console.error
    })
  },
  readmore(){
    wx.request({
      url: app.globalData.urlBase + '/sortByMsg',
      success: res => {
        console.log(res.data);
        if (res.data.code == 200) {
          let out = "成功读取" + res.data.msg.length + "条信息";
          for(const msg of res.data.msg){
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
  //表单提交触发此函数
  formSubmit(e) {
    wx.request({
      url: app.globalData.urlBase + '/addMsg',
      method: "POST",
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
  getOpenId(){
    wx.login({
      success: res=>{
        wx.request({
          url: app.globalData.urlBase + '/newUser',
          method: "POST",
          data: {
            code: res.code
          },
          success: (rec) => {
            console.log(rec.data);
            if (rec.data.code == 200)
              wx.showModal({
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
  }
})