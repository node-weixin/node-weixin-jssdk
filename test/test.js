'use strict';
var assert = require('assert');
var nodeWeixinJssdk = require('../');



describe('node-weixin-jssdk node module', function () {
  it('should be able to get jsapi_ticket', function (done) {
    var config = require('node-weixin-config');

    var app = {
      id: process.env.APP_ID,
      secret: process.env.APP_SECRET,
      token: process.env.APP_TOKEN
    };

    console.log(app);

    var url = 'http://wx.t1bao.com/pay';
    config.app.init(app);
    nodeWeixinJssdk.prepare(config.app, url, function(error, data) {
      assert.equal(true, !error);
      assert.equal(true, data.appId === app.id);
      assert.equal(true, data.signature.length > 1);
      assert.equal(true, data.nonceStr.length > 1);
      assert.equal(true, data.timestamp.length > 1);
      done();
    });
  });
});