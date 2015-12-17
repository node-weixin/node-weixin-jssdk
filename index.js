'use strict';
var restful = require('node-weixin-request');
var util = require('node-weixin-util');
var crypto = require('crypto');
var baseUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/';

var jssdk = {
  //Last time got a token
  TICKET_EXP: 7200 * 1000,
  //for real use
  /**
   * Prepare a config for jssdk to be enabled in weixin browser
   * @param auth
   * @param app
   * @param url
   * @param cb
   */
  prepare: function (app, auth, url, cb) {
    var self = this;
    app.__jssdk = app.__jssdk || {};
    auth.determine(app, function () {
      self.signify(app, auth, url, function (error, json) {
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
   * @param auth
   * @param app
   * @param url
   * @param cb
   */
  signify: function (app, auth, url, cb) {
    var self = this;
    this.getTicket(app, auth, function (error, ticket) {
      if (!error) {
        var config = self.generate(ticket, url);
        var signature = self.sign(config);
        config.signature = signature;
        cb(false, config);
      } else {
        cb(true);
      }
    });
  },
  getTicket: function (app, auth, cb) {
    app.__jssdk.passed = false;
    var now = new Date().getTime();
    if (app.__jssdk.lastTime && (now - app.__jssdk.lastTime < this.TICKET_EXP)) {
      app.__jssdk.passed = true;
      cb(false, app.__jssdk.ticket);
      return;
    }
    app.__jssdk.lastTime = now;
    var params = {
      type: 'jsapi',
      access_token: app.auth.accessToken
    };
    var url = baseUrl + 'getticket?' + util.toParam(params);
    restful.request(url, null, function (error, json) {
      if (json.errcode === 0) {
        app.__jssdk.ticket = json.ticket;

        cb(false, json.ticket);
      } else {
        cb(true);
      }
    });
  },
  sign: function (config, type) {
    var str = util.marshall(config);
    var sha1 = crypto.createHash(type || 'sha1');
    sha1.update(str);
    return sha1.digest('hex');
  },
  generate: function (ticket, url) {
    var timestamp = String((new Date().getTime() / 1000).toFixed(0));
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
