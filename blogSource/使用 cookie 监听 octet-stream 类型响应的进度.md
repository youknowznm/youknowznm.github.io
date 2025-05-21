# 使用 cookie 监听 octet-stream 类型响应的进度

## 现有的下载组件逻辑

1. 提供一个可见的表单和一个隐藏的 `iframe`, 通过同一个 `rmd` 设置它们的 `id` 和 target

- 该表单的 `target` 为 iframe, `action` 为 目标 url

2. 表单包含一个可见的 `submit` 按钮, 若干个 `type=hidden` 的 `input`
3. 这些 `input` 的值通过 `prop` 被传入组件, 在点击 `submit` 提交表单时作为 `post` 请求的 `param`
4. 设置表 `target` 为 `iframe` 时,表单的回复会加载在这个 `iframe` 里

- **注意后端对此没有处理, 报错就随便报了, 没有返回到前端**

5. 如果后端处理成功, 会以 `content-type: octec-stream` 二进制文件的形式响应, 浏览器对其的默认处理方式就是下载

## 问题

1. 后端处理 `submit` 失败时, 没有给前端通知
2. **由于请求以流的形式返回, 前端无法拿到下载结束(成功或失败)的钩子**

## 影响场景

典型地, 在请求导出包含大量数据的 Excel 文件时, 响应时间会很长.  
需要基于 UI loading 相关的交互, 并得知下载结果成功与否.

## 改进

1. 提供可配置的组件 prop `type`, 值为 `onload` 或 `cookie`
2. 选 `onload` 则延用原逻辑, 选 `cookie` 则将初始化时的 `rmd` 以 `token` 形式作为一个 `input` 传入表单
3. 后端拿到本次请求的 token(如 `foo`), 处理数据
4. 处理完成后将结果(Y/N) 作为名为 `download-foo` 的 cookie 值

- 成功则返回文件流
- 失败则以 `json` 形式返回错误内容, 填入 `iframe`

5. 前端在表单提交时, 即开始轮询名为 `download-foo` 的 cookie, 有值后 (Y/N) 则认为请求已经成功/失败

## 更多

也许可以结合 `XMLHttpRequest.onprogress` 事件和响应头的 `content-length` 来实现和优化, 后续再调研