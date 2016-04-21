'use strict';
var assert = require('assert');
var nodeWeixinJssdk = require('../lib/index');
var config = require('node-weixin-config');
var settings = require('node-weixin-settings');

var app = {
  id: process.env.APP_ID,
  secret: process.env.APP_SECRET,
  token: process.env.APP_TOKEN
};

config.app.init(app);

var url = 'http://wx.t1bao.com/pay';

describe('node-weixin-jssdk node module', function () {
  it('should be able to get jsapi_ticket', function (done) {
    nodeWeixinJssdk.prepare(settings, app, url, function (error, data) {
      settings.get(app.id, 'jssdk', function (jssdk) {
        assert.equal(true, !error);
        assert.equal(true, jssdk.passed === false);
        assert.equal(true, data.appId === app.id);
        assert.equal(true, data.signature.length > 1);
        assert.equal(true, data.nonceStr.length > 1);
        assert.equal(true, data.timestamp.length > 1);
        done();
      });
    });
  });

  it('should be able to get jsapi_ticket', function (done) {
    nodeWeixinJssdk.prepare(settings, app, url, function (error, data) {
      settings.get(app.id, 'jssdk', function (jssdk) {
        assert.equal(true, !error);
        assert.equal(true, jssdk.passed === true);
        assert.equal(true, data.appId === app.id);
        assert.equal(true, data.signature.length > 1);
        assert.equal(true, data.nonceStr.length > 1);
        assert.equal(true, data.timestamp.length > 1);
        done();
      });
    });
  });

  it('should be fail to get jsapi_ticket', function (done) {
    nodeWeixinJssdk.prepare(settings, {}, url, function (error) {
      assert.equal(true, error);
      done();
    });
  });
});
