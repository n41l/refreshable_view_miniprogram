# refreshable_view_miniprogram

[![Platforms](https://img.shields.io/badge/Platforms-WeChat-green?style=flat-square)](https://img.shields.io/badge/Platforms-macOS_iOS_tvOS_watchOS_Linux_Windows-Green?style=flat-square)
[![](https://img.shields.io/npm/v/refreshable_view_miniprogram)](https://github.com/n41l/refreshable-view-miniprogram)
[![](https://img.shields.io/npm/l/refreshable_view_miniprogram)](https://github.com/n41l/refreshable-gview-miniprogram)

Refreshable View通过简单的方式实现了scroll-view的下拉刷新以及滚动加载，并且提供了便利的自定义机制，方便用户替换不同的刷新/加载方式与动画。

- [特点](#特点)
- [要求](#要求)
- [安装说明](#安装说明)
- [使用说明](#使用说明)
    - [参数说明](#组件参数说明)
    - [RefresherType类型说明](#RefresherType类型说明)
    - [LottieLoadings类型说明](#LottieLoadings类型说明)
    - [组件事件说明](#组件事件说明)
    - [使用案例](#使用案例)
- [使用许可](#使用许可)

## 特点

- [x] 下拉刷新/加载
- [x] 滚动刷新/加载
- [x] 基于 [lottie](https://github.com/airbnb/lottie-web) 的加载动画
- [x] 自定义 `lottie` 动画
- [x] 兼容刷新/加载打断
- [x] 加载动画时长控制
- [ ] 完全自定义的加载动画（未测试）
- [ ] 兼容横向刷新/加载
- [ ] 加载结果提示

## 效果展示

- 组件效果

<table>
    <tr>
        <th><img width="300" alt="build-npm" src="https://user-images.githubusercontent.com/4735195/124853205-16009900-dfd8-11eb-9583-0277955f5a76.gif"></th>
        <th><img width="300" alt="build-npm" src="https://user-images.githubusercontent.com/4735195/124853227-1d27a700-dfd8-11eb-8c84-074be7f11448.gif"></th>
    </tr>
    <tr>
        <th>下拉刷新</th>
        <th>上拉加载</th>
    </tr>
</table>

* 预设动画

<table>
    <tr>
        <th>
            <img width="150" src="https://user-images.githubusercontent.com/4735195/124854936-c079bb80-dfda-11eb-9944-208cac840202.gif"/>
        </th>
        <th>
            <img width="150" src="https://user-images.githubusercontent.com/4735195/124855884-36325700-dfdc-11eb-8f2c-ec6b6981f001.gif"/>
        </th>
        <th>
            <img width="150" src="https://user-images.githubusercontent.com/4735195/124858008-db9afa00-dfdf-11eb-93c5-29e220542a9b.gif"/>
        </th>
        <th>
            <img width="150" src="https://user-images.githubusercontent.com/4735195/124856715-9bd31300-dfdd-11eb-969c-d7df648658a9.gif"/>
        </th>            
    </tr>
    <tr>
        <th><a href="https://lottiefiles.com/67313-lava-preloader">lava-preloader</a></th>
        <th><a href="https://lottiefiles.com/67127-heart-fill">heart-fill</a></th>
        <th><a href="https://lottiefiles.com/63872-circular-animations">circle</a></th>
        <th><a href="https://lottiefiles.com/66818-holographic-radar">holographic-radar</a></th>
    </tr>
</table>
<table>
    <tr>           
        <th>
            <img width="150" src="https://user-images.githubusercontent.com/4735195/124856815-cae98480-dfdd-11eb-8cbb-4033e6859f23.gif"/>
        </th>
        <th>
            <img width="150" src="https://user-images.githubusercontent.com/4735195/124856889-ece30700-dfdd-11eb-8f95-fe3cb7d9738c.gif"/>
        </th>
        <th>
            <img width="150" src="https://user-images.githubusercontent.com/4735195/124856158-9de8a200-dfdc-11eb-8f7e-6b7f2305766b.gif"/>
        </th>
    </tr>
    <tr>
        <th><a href="https://lottiefiles.com/65911-loading-down-fall">loading-down-fall</a></th>
        <th><a href="https://lottiefiles.com/793-cycle-animation">cycle-man</a></th>
        <th><a href="https://lottiefiles.com/66997-airplane">airplane</a></th>
    </tr>
</table>

在整个基于 lottie 的动画处理中，都是直接传递 [lottiefiles.com](https://lottiefiles.com) 中的 lottie json 文件地址来实现的，你也选择任何你喜爱的动画（不过貌似微信小程序的 canvas 绘制表现会有某些不兼容)，在这里感谢以上这些动画的作者。

## 要求

| 平台 | 最低基础库版本 | 安装说明 | 状态 |
| --- | --- | --- | --- |
| WeChat | 2.8.3 | [npm](#npm) | 未全部实机测试 |

## 安装说明

### npm 

[npm](https://www.npmjs.com/) 是 JavaScript 世界的包管理工具,并且是 Node.js 平台的默认包管理工具。通过 npm 可以安装、共享、分发代码,管理项目依赖关系。 

1. 安装 npm 包

首先在小程序根目录下(如果根目录中已经存在`package.json`文件则直接添加依赖):

```ruby
npm init
```

生成npm的`package.json`配置文件，并且添加依赖:

```json
{
  "dependencies": {
      "refreshable_view_miniprogram": "^0.1.0"
    }
}
```

在小程序根目录中执行命令安装 npm 包:

```
npm install
```

也可以跳过对`package.json`文件对配置，直接进行安装:

```ruby
npm install --save refreshable-view-miniprogram
```

2. 构建 npm

点击微信开发者工具中的菜单栏：工具--->构建 npm :

<img width="600" alt="build-npm" src="https://user-images.githubusercontent.com/4735195/124853341-48aa9180-dfd8-11eb-9c9e-3c58c6fcb8f9.png">

3. 使用 npm 模块

点击微信开发工具：详情--->本地设置--->使用 npm 模块:

<img width="600" alt="build-npm" src="https://user-images.githubusercontent.com/4735195/124853492-8ad3d300-dfd8-11eb-886d-8fed88fdd084.jpg">

4. 使用 npm 包

* js文件中引入:

```js
import {LottieLoadings} from 'refreshable-view-miniprogram/utilies/lotte-loadings';
import {RefresherType} from "refreshable-view-miniprogram/index";
```

* 组件引入:

```json
{
  "usingComponents": {
    "refreshable-view": "refreshable-view-miniprogram/index"
  }
}
```

> 其他微信小程序 npm 使用问题可以参考[说明](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)

## 使用说明

### 组件参数说明

| 参数 | 数值类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| enableLeadingRefresh | Boolean | true | 控制是否可以进行 Leading 刷新/加载操作 |
| enableTrailingRefresh | Boolean | true | 控制是否可以进行 Trailing 刷新/加载操作 |
| leadingRefresherType | RefresherType | 参见下文 | 控制 Leading Refresher 的表现 |
| trailingRefresherType | RefresherType | 参见下文 | 控制 Trailing Refresher 的表现 |
| leadingPullingThreshold | Number | 50 | 控制激活 Leading Refresh 的阈值 |
| trailingPullingThreshold | Number | 50 | 控制激活 Trailing Refresh 的阈值 |
| minimumRefreshDuration | Number | 1200 | 控制刷新动画时长 ｜

### RefresherType类型说明

```js
// 默认RefresherType 数据
RefresherType({
  type: 'lottie-loading',
  height: 50,
  data: LottieLoadings.circle()
})
```

- `type` 参数:

* `'lottie-loading'` ，基于 pull to refresh 机制进行刷新/加载，使用 `lottie` 动画实现刷新/加载的用户反馈
* `'custom-loading'` ，基于 pull to refresh 机制进行刷新/加载，使用用户自定义动画实现刷新/加载的用户反馈
* `'sentinel-loading'` ，基于 scroll to load 机制进行刷新/加载
* `'none'` ，关闭刷新/加载

- `height` 参数:

在 `type` 参数为 `'lottie-loading'` 和 `'custom-loading'` 时有效，用于控制 Refresher 的高度。

- `data` 参数:

在 `type` 参数为 `'lottie-loading'` 时有效，用于控制 Refresher 的动画表现

### LottieLoadings类型说明

```javascript
LottieLoadings({
  path: 'https://assets6.lottiefiles.com/packages/lf20_mniampqn.json',
  speed: 2
})
```

- `path` 参数:

`lottie` 动画的 url 地址，默认数据来源于[lottiefiles.com](https://lottiefiles.com/)

- `speed` 参数：

控制 `lottie` 动画的播放速度

> 在这里预设了七个不同的加载动画，你也可以自己生成其他 LottieLoadings 对象来自定义加载动画

### 组件事件说明

- `onLeadingPulling` 与 `onTrailingPulling` 事件

当对应 RefresherType 的类型为 `'lottie-loading'` 或 `'custom-loading'` 时才会触发此类事件，并且回返回以下数据信息：

```js
{
  instance,                     // 当前组件的实例对象 
  offset,                       // 下拉刷新的偏移值
  percentage                    // 下拉刷新的偏移值与下拉刷新的阈值的比值
}
```

- `onLeadingRefreshing` 与 `onTrailingRefreshing` 事件

当对应 RefresherType 的类型不为 `'none'` 时都会触发此类事件，并且返回以下数据信息：

```js
{
  instance,                    // 当前组件的实例对象
  success(completion),         // 刷新成功的回调函数，在数据刷新结束后调用 success 方法并且将页面刷新代码传入 completion 回调 
  fial                         // 暂未实现
}
```

### 使用案例

该案例中有以下几点需要注意：

1. 为了滚动手势的正确性，在 `index.json` 中设置 `disableScroll: true` 。
2. 模拟器上测试时需在微信开发者工具中关闭域名校验，实机测试请开启调试模式。
3. 模拟数据的 API 来自于 [Random Data API](https://random-data-api.com/) ，头像 API 来自于 [DiceBear Avatars](https://avatars.dicebear.com/) ，在这里表示感谢，其次国内访问他们 API 貌似会有卡顿，可尝试科学上网。

> 具体参看 [Demo](https://github.com/n41l/refreshable-view-miniprogram/blob/main/tools/demo/pages/index/index.js) 。
> 本项目基于 [小程序自定义组件开发模版](https://github.com/wechat-miniprogram/miniprogram-custom-component) 开发，具体测试操作参见该模板说明。

## 使用许可

refreshable-view-miniprogram is released under the MIT license. [查看详情](https://github.com/n41l/refreshable-view-miniprogram/blob/main/LICENSE)
