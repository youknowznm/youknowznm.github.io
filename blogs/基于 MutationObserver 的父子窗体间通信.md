# 基于 MutationObserver 的父子窗体间通信

## 基础

- 一个浏览器的多个标签页和被嵌入的页都是独立的浏览上下文, 每个上下文都有独立的 `window` 对象, 之间互不干扰
- 任何窗体中的 JavaScript 都可以:
    - 引用其所在的窗体为 `window` 或 `self`
    - 引用其父级窗体为 `parent`
    - 引用其顶级窗体为 `top`
    - `<iframe>` 的 `contentWindow` 属性指向其 `window` 对象, `contentDocument` 指向其 `document` 对象
    - **无法访问不同源的窗体除 `contentWindow` 外的几乎所有属性**

## 需求

1. 在旧项目的某个页面 A 中嵌入新项目的页面 B
2. 页面 B 在嵌入页面 A 时, 样式和逻辑与在浏览器窗体正常打开时不同
3. 页面 B 的内容高度是不固定的
4. 页面 B 加载完成后, 页面 A 需滚动到一定的位置, 使页面 B 上的指定元素进入视口
5. **两个项目不同源**

## 思路

1. 在页面 A 添加 `<iframe>` 元素, 指定其 `src` 为页面 B 的 url
2. 对页面 A 中的该 url 添加特殊的 query (如 `?isFromPageA=true`), 修改页面 B 逻辑, 初始化时若获取到这个 query 则特殊对待
3. 在页面 B 的加载过程中, 将指定的数据跨越传递给页面 A, 后者需要监听这些数据(4, 5 同理)

## 怎样传递?

### 1. 发送

在发送者窗体通过 `window.postMessage` 实现向不同源的另一页面的通信.

```javascript
// 语法
receiverWindow.postMessage(message, receiverOrigin, [transfer])

// receiverWindow
// 接收者窗体的引用. 比如 iframe 的 contentWindow 属性, 通过 window.open 返回的窗体对象

// message
// 要发送的数据. 可为任意类型, 无需序列化

// receiverOrigin
// 指定哪些窗体能接收到消息. 可为*或一个 url

// transfer
// 若干和 message 一起传递的 Transferable 对象. 其所有权会被转移给消息的接收者
```

### 2. 接收

在接收者窗体监听来自指定源的 `message` 事件.

```javascript
window.addEventListener('message', receivedMessage, false)

// receivedMessage 有以下属性:

// data
// 其它窗体传来的消息数据.

// origin
// postMessage 发送者窗体的源.

// source
// postMessage 发送者窗体的引用. 可用来在两个窗体间双向通信
```

## 什么时候传递?

> 以仅观察页面高度为例

### 思路一: 对目标元素进行内容轮询, 一段时间内某个属性未产生变动, 则认为已加载完成

```javascript
let interval = 500
let pageHeight = document.body.scrollHeight
let newPageHeight = 0
let timerId = setInterval(() => {
  newPageHeight = document.body.scrollHeight
  if (newPageHeight === pageHeight) {
    clearInterval(timerId)
    window.parent.postMessage({height: newPageHeight}, '*')
  } else {
    pageHeight = newPageHeight
  }
}, interval)
```

### 不足

难以确定 interval 的有效值.

- 设置过小, 完成数据请求和渲染的时间大于此间隔, 则传递给页面 A 的未必是加载的最终结果
- 设置过大, 严重影响用户体验

### 思路二: 每隔一段时间, 重新获取目标元素的属性, 将其传递给页面 A

```javascript
let interval = 500
setInterval(() => {
  window.parent.postMessage({height: document.body.scrollHeight}, '*')
}, interval)
```

### 不足

- 没有清除掉计时器(无法得知清除实机)
- 要观察的元素/属性较多时会产生大量的回流, 可能影响性能

### 思路三: 使用 `MutationObserver` + `debounce` 观察目标元素的属性变动, 只在变动发生时传递消息

```javascript
// 构造器语法
let observer = new MutationObserver(callback)

// callback
// 回调函数. 在指定的目标DOM节点发生变动时调用, 传入的第一个参数为由MutationRecord对象构成的数组
// MutationRecord包含以下属性:
//   - type: childList|attributes|characterData(见下)
//   - target: 此次变动具体影响到的节点
//   - 其它属性记录具体变动, 不一一列举了
```

```javascript
// 实例语法
observer.observe(targetNode, optionObj)

// targetNode
// 要观察的 DOM 节点.

// optionObj
// 选项对象. 可配置:
//   - childList: 需要观察目标节点的子节点(新增或移除), 则设置为 true
//   - attributes: 需要观察目标节点的属性节点( nodeType 为2), 则设置为 true
//   - characterData: 需要观察目标节点的文本或注释节点( nodeType 为3或8), 则设置为 true
//   - subtree: 需要观察目标节点的所有后代节点, 则设置为 true
//   - 其它配置项用于记录属性的旧值和过滤指定的属性, 不一一列举了
```

### 优点

- 把 DOM 变动记录封装成一个数组进行处理，而不是一条条地单独处理
- 可配置, 方便精细地控制观察的范围
- 属于异步的微任务(类似 xhr, promise 和 DOM 事件), 与 `setInterval` 等宏任务相比执行更快

### 实现

```javascript
let debouncedPostMessage = debounce(msgObj => {
  window.parent.postMessage(msgObj, '*')
}, 200)
let observer = new MutationObserver(() => {
  // 观察范围较大, 会触发很多次, 不妨用 debounce 优化
  debouncedPostMessage({pageHeight: document.body.scrollHeight})
})
observer.observe(document.querySelector('.target-area' /* 观察 body 或其它元素均可 */), {
  childList: true,
  subtree: true
})
```

### 不足

- IE11 及以上才支持, 可按需使用 [polyfill](https://github.com/megawac/MutationObserver.js)
