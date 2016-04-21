'use strict';
var restful = require('node-weixin-request');
var util = require('node-weixin-util');
var auth = require('node-weixin-auth');
var crypto = require('crypto');
var baseUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/';

module.exports = {
  // Last time got a token
  TICKET_EXP: 7200 * 1000,
  // for real use
  /**
   * Prepare a config for jssdk to be enabled in weixin browser
   * @param auth
   * @param app
   * @param url
   * @param cb
   */
  prepare: function (settings, app, url, cb) {
    var self = this;
    auth.determine(settings, app, function () {
      self.signify(settings, app, url, function (error, json) {
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
  signify: function (settings, app, url, cb) {
    var self = this;
    this.getTicket(settings, app, function (error, ticket) {
      if (error) {
        cb(true);
      } else {
        var config = self.generate(ticket, url);
        var signature = self.sign(config);
        config.signature = signature;
        cb(false, config);
      }
    });
  },
  getTicket: function (settings, app, cb) {
    var self = this;

    settings.get(app.id, 'jssdk', function (jssdk) {
      if (!jssdk) {
        jssdk = {};
      }
      jssdk.passed = false;
      var now = new Date().getTime();
      if (jssdk.lastTime && (now - jssdk.lastTime < self.TICKET_EXP)) {
        jssdk.passed = true;
        cb(false, jssdk.ticket);
        return;
      }
      jssdk.lastTime = now;
      settings.get(app.id, 'auth', function (authData) {
        var params = {
          type: 'jsapi',
          /* eslint camelcase: [2, {properties: "never"}] */
          access_token: authData.accessToken
        };
        settings.set(app.id, 'jssdk', jssdk, function () {
          var url = baseUrl + 'getticket?' + util.toParam(params);
          var callback = function (error, json) {
            if (json.errcode === 0) {
              jssdk.ticket = json.ticket;
              settings.set(app.id, 'jssdk', jssdk, function () {
                cb(false, json.ticket);
              });
            } else {
              console.error(json);
              cb(true);
            }
          };
          restful.request(url, null, callback);
        });
      });
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
