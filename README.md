# content conquer
![Node.js CI](https://github.com/mubaidr/vue-chrome-extension-boilerplate/workflows/Node.js%20CI/badge.svg)[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)

用于屏蔽各种信息流、商品流里面你不想要的信息，比如淘宝、京东、微博、知乎；

## 安装

下载zip包：[content-and-conquer-v1.0.0.zip](https://github.com/justdark/content-conquer/raw/master/dist-zip/content%20and%20conquer-v1.0.0.zip)
拖到chrome插件页面进行安装


## 使用

**对于普通用户只需要配置相关的屏蔽词即可**

<img src="https://github.com/justdark/content-conquer/blob/master/config.jpg?raw=true" width="300px"></img>
 ![result](https://github.com/justdark/content-conquer/blob/master/result.jpg?raw=true)


## for developer

具体支持哪些页面和信息流的过滤，依赖于CACConfig.json，可以自行编辑代码，后面有需要再放开通过配置进行编辑

一个典型的配置项说明如下：

```json
  {
        "name":"zhihu",
        "urls":["www.zhihu.com/*"],
        "keys":[{
            "name":"zhihu_feed_title",
            "showName":"知乎Feed标题包含",
            "type":"contain",
            "path":["div.Feed@h2.ContentItem-title"]
        }]
  } 
```
- urls:是支持的页面通配符，不需要https://
- keys:支持校验的项目，每个项目就是配置页面的一个item：
    * name:需要是英文+下划线
    * showName:配置页面展示的名称
    * type:类型，支持is或者contain
    * path:元素的位置信息，@分割：
      * 第一项通过document.querySelectorAll查询到的list，就是命中黑名单之后会删除的项目
      * 后面的位置信息，会逐个对上面的list节点进行querySelectorAll并取第一个操作，直到最后获得元素的innerText信息作为校验值
      * 以上面的配置为例，你可以在知乎页面的控制台运行 `document.querySelectorAll("div.Feed")[0].querySelectorAll("h2.ContentItem-title")[0].innerText` 拿到第一个用于校验的值，最后程序用的就是这个东西


如果你需要二次开发，这个项目是基于[vue-chrome-extension-boilerplate](https://github.com/mubaidr/vue-chrome-extension-boilerplate)进行开发的：

## Scripts

```json
// install dependencies
npm install

// build extension and watch for changes
npm run dev

// build extension zip
npm run build

// lint all source files
npm run lint
```

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
