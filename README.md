#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> JSSDK Functions for weixin


## Install

```sh
$ npm install --save node-weixin-jssdk
```


## Usage

```js

var config = require('node-weixin-config');
var auth = require('node-weixin-auth');
var nodeWeixinJssdk = require('node-weixin-jssdk').create();

var app = {
  id: process.env.APP_ID,
  secret: process.env.APP_SECRET,
  token: process.env.APP_TOKEN
};

var url = 'http://wx.domain.com/jssdk';
config.app.init(app);
nodeWeixinJssdk.prepare(app, url, function(error, data) {
  //data.appId
  //data.signature
  //data.noneStr
  //data.timestamp
});
```


## License

MIT © [JSSDKCN](blog.3gcnbeta.com)


[npm-image]: https://badge.fury.io/js/node-weixin-jssdk.svg
[npm-url]: https://npmjs.org/package/node-weixin-jssdk
[travis-image]: https://travis-ci.org/JSSDKCN/node-weixin-jssdk.svg?branch=master
[travis-url]: https://travis-ci.org/JSSDKCN/node-weixin-jssdk
[daviddm-image]: https://david-dm.org/JSSDKCN/node-weixin-jssdk.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/JSSDKCN/node-weixin-jssdk
