'use strict';
var restful = require('node-weixin-request');
var util = require('node-weixin-util');
var crypto = require('crypto');
var baseUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/';

var _ = require("lodash");

function JSSDK() {
}
var jssdk = {
  ticket: null,
  //Last time got a token
  lastTime: null,
  TICKET_EXP: 7200 * 1000,
  passed: false, //For test only
  //for real use
  /**
   * Prepare a config for jssdk to be enabled in weixin browser
   * @param auth
   * @param app
   * @param url
   * @param cb
   */
  prepare: function (auth, app, url, cb) {
    var self = this;
    auth.determine(app, function () {
      self.signify(auth, app, url, function (error, json) {
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
  signify: function (auth, app, url, cb) {
    var self = this;
    this.getTicket(auth, app, function (error, ticket) {
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
  getTicket: function (auth, app, cb) {
    this.passed = false;
    var now = new Date().getTime();
    if (this.lastTime && (now - this.lastTime < this.TICKET_EXP)) {
      this.passed = true;
      cb(false, this.ticket);
      return;
    }
    this.lastTime = now;
    var params = {
      type: 'jsapi',
      access_token: auth.accessToken
    };
    var url = baseUrl + 'getticket?' + util.toParam(params);
    var self = this;
    restful.request(url, null, function (error, json) {
      if (json.errcode === 0) {
        self.ticket = json.ticket;
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
  },
  create: function() {
    return new JSSDK();
  }
};


_.extend(JSSDK.prototype, jssdk);
module.exports = new JSSDK();
