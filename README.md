# node-weixin-jssdk [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

> JSSDK Functions for weixin


## Install

```sh
$ npm install --save node-weixin-jssdk
```


## Usage

0.2.3之前的版本使用请见[这里](https://github.com/node-weixin/node-weixin-jssdk/wiki/0.2.3%E5%8F%8A%E4%B9%8B%E5%89%8D%E7%9A%84%E7%89%88%E6%9C%AC%E7%9A%84%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95)

jssdk已经更新，不再需要传入auth模板,
一般建议配合 [node-weixin-router](https://github.com/node-weixin/node-weixin-router)使用。
单独使用时可参考router里面的实现
代码示例如下：

```js
var router = require('node-weixin-router');
var settings = require('node-weixin-settings');

module.exports = {
  config: function (req, res) {
    var url = null;
    var keys = ['body', 'query', 'params'];
    //1.获取传入的URL
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (req[k] && req[k].url) {
        url = req[k].url;
        break;
      }
    }
    //2.获取ID
    var id = router.getId(req);
    //3.获取app,必须初始化时保存或者已经提前保存到settings里面
    var app = settings.get(id, 'app');
    //4. 初始化jssdk匹配
    weixin.jssdk.prepare(app, url, function() {
    });
  }
};
```

## License

Apache-2.0 © [calidion](calidion.github.io)


[npm-image]: https://badge.fury.io/js/node-weixin-jssdk.svg
[npm-url]: https://npmjs.org/package/node-weixin-jssdk
[travis-image]: https://travis-ci.org/node-weixin/node-weixin-jssdk.svg?branch=master
[travis-url]: https://travis-ci.org/node-weixin/node-weixin-jssdk
[daviddm-image]: https://david-dm.org/node-weixin/node-weixin-jssdk.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/node-weixin/node-weixin-jssdk
[coveralls-image]: https://coveralls.io/repos/node-weixin/node-weixin-jssdk/badge.svg
[coveralls-url]: https://coveralls.io/r/node-weixin/node-weixin-jssdk
