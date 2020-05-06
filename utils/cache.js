function setCache(key, val, time) {

  wx.setStorageSync(key, val);

  var seconds = parseInt(time);

  if (seconds > 0) {

    var timestamp = Date.parse(new Date());

    timestamp = timestamp / 1000 + seconds;

    wx.setStorageSync(key + 'dtime', timestamp + "");

  } else {
    wx.removeStorageSync(key + 'dtime');
  }

}

function getCache(key, def) {

  var deadtime = parseInt(wx.getStorageSync(key + 'dtime'));

  if (deadtime) {
    
    if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
      if (def) { 
        return def; 
      } else {
         return;
      }
    }else{
      var res = wx.getStorageSync(key);
      if (res) {
        return res;
      } else {
        return def;
      }
    }
  }else{
    def;
  }

  
}


module.exports={
    setCache: setCache,
    getCache: getCache
}