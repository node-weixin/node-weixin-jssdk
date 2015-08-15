'use strict';
var restful = require('node-weixin-request');
var auth = require('node-weixin-auth');
var util = require('node-weixin-util');

var crypto = require('crypto');
var baseUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/';

var ticket = null;

//Last time got a token
var lastTime = null;
var jssdk = {
  TICKET_EXP: 7200 * 1000,
  passed: false,  //For test only
  //for real use
  /**
   * Prepare a config for jssdk to be enabled in weixin browser
   * @param app
   * @param url
   * @param cb
   */
  prepare: function(app, url, cb) {
    auth.determine(app, function () {
      jssdk.signify(app, url, function (error, json) {
        if (!error && !json.errcode) {
          cb(false, {
            appId: app.id,
            signature: json.signature,
            nonceStr: json.noncestr,
            timestamp: json.timestamp
          });
        } else {
          cb(true, error);
        }
      });
    });
  },

  /**
   * Get config
   *
   * @param app
   * @param url
   * @param cb
   */
  signify: function (app, url, cb) {
    jssdk.getTicket(app, function (error, ticket) {
      if (!error) {
        var config = jssdk.generate(ticket, url);
        var signature = jssdk.sign(config);
        config.signature = signature;
        cb(false, config);
      } else {
        cb(true);
      }
    });
  },
  getTicket: function (app, cb) {
    jssdk.passed = false;
    var now = new Date().getTime();

    if (lastTime && (now - lastTime < jssdk.TICKET_EXP)) {
      jssdk.passed = true;
      cb(false, ticket);
      return;
    }
    lastTime = now;
    var params = {
      type: 'jsapi',
      access_token: auth.accessToken
    };
    var url = baseUrl + 'getticket?' + util.toParam(params);
    restful.request(url, null, function (error, json) {
      if (json.errcode === 0) {
        ticket = json.ticket;
        cb(false, json.ticket);
      } else {
        cb(true);
      }
    });
  },

  sign: function(config, type) {
    var str = util.marshall(config);
    var sha1 = crypto.createHash(type || 'sha1');
    sha1.update(str);
    return sha1.digest('hex');
  },
  generate: function (ticket, url) {
    var timestamp = String(new Date().getTime());
    var sha1 = crypto.createHash('sha1');
    sha1.update(timestamp);
    var noncestr = sha1.digest('hex');
    return {
      jsapi_ticket: ticket,
      noncestr: noncestr,
      timestamp: timestamp,
      url: url
    };
  }
};
module.exports = jssdk;

