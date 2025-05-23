# 尝试实现一个低配版 express

使用 nodejs 时不一定用到 express 这样重型的框架. 例如将其作为站点的 API 层, 不负责渲染数据到模板里并返回, 所有路由以
JSON 结束响应. 这里尝试实现一个简单的服务器, 提供和 express
相似的路由和中间件接口.

## 路由

先看下 nodejs HTTP 模块的创建服务器方法:

```javascript
/**
 @param requestListener {Function} 对请求的监听函数, 传入 req 和 res 两个参数
 @return server {http.Server} 一个服务器实例
 */
http.createServer(requestListener)
```

每个 http 请求到来时, 参数方法内的逻辑都会被执行. 需要有一个路由对象组成的数组, 针对每一个请求遍历它, 获取匹配的路由, 对
req 对象进行处理, 再调用 res 的 `writeHead`, `end` 等方法, 结束响应.
注意这里的 req 和 res 分别是 Node 原生的 `http.ClientRequest` 和 `http.ServerResponse` 类的实例, 不是经过 express 增强的
`Request` 和 `Response`.

这样, 每个路由对象应该包含三个属性: 请求方法(method), 请求 URL(path)和处理函数(handler). 仿照 express 的 API, 通过
`app.method(path, handler)` 形式添加路由.
大致的结构如下:

```javascript
// 创建一个 MiniExpress 类
class MiniExpress {
  constructor() {
    this.routes = []
    // 把常用的 http 方法动词存入一个数组, 最后加上 express 风格的 'all', 可匹配所有方法
    const HTTP_METHODS = ['get', 'post', 'put', 'delete', 'options', 'all']
    // 遍历方法名的数组, 给本类添加同名的成员方法
    // 该方法接受 path 和 handler 两个参数, 在被调用时推入一个路由对象至路由数组
    HTTP_METHODS.forEach((method) => {
      this[method] = (path, handler) => {
        this.routes.push({method, path, handler})
      }
    })
  }
}
```

这时如果:

```javascript
const app = new MiniExpress()
app.get('/', (req, res) => {
  res.end('This is index.')
})
```

调用后的路由数组是这样的:

```javascript
[
  {
    method: 'get',
    path: '/',
    handler: (req, res) => {
      res.end('This is index.')
    },
  },
]
```

接收到一个请求时, 遍历这个数组. 找到了方法名和路径都匹配的目标数组对象后, 返回它的处理函数(即定义的接受 req 和 res
两个参数的函数). 在类中定义这个成员方法:

```javascript
class MiniExpress {
  constructor() {
    // ...
  }

  getRouterHandler(targetMethod, targetPath) {
    // 如果找不到目标路由, 则以一条错误字符串结束相应
    let resultFn = (req, res) => {
      res.end(`## Router Not Found: ${targetMethod} ${targetPath}`)
    }
    for (let route of routes) {
      const {path, method, handler} = route
      if ([targetPath, '*'].includes(path) && [targetMethod, 'all'].includes(method)) {
        // 如果找到了目标路由, 则返回其处理函数
        // 模仿 express 的风格, '*' 可匹配所有 path, 'all' 可匹配所有 method
        resultFn = handler
        break
      }
    }
    return resultFn
  }
}
```

还需要一个传入 `http.createServer()` 的参数 `requestListener`, 它要做的事情是: 获取请求的方法和路径, 调用上面定义的
getRouterHandler, 以合适的处理函数结束相应.

```javascript
class MiniExpress {
  constructor() {
    // ...
  }

  getRouterHandler(targetMethod, targetPath) {
    // ...
  }

  // 定义对所有请求的监听函数, 用作 http.createServer() 的参数
  requestListener(req, res) {
    const method = req.method.toLowerCase()
    const pathname = require('url').parse(req.url).pathname
    // 通过 getRouterHandler 获取路由的处理函数, 调用之, 传入 req 和 res
    getRouterHandler(this.routes, method, pathname)(req, res)
  }
}
```

在定义了所有需要的路由之后, 要调用 `http.Server` 实例的 listen 方法, 在指定的主机和端口上开启服务器, 监听连接. 在类上添加
listen 成员方法.

```javascript
class MiniExpress {
  constructor() {
    // ...
  }

  getRouterHandler(targetMethod, targetPath) {
    // ...
  }

  requestListener(req, res) {
    // ...
  }

  // 默认在本地的4000端口监听. 服务器就绪后打印 log
  listen(port = 4000, host = 'localhost') {
    http
        .createServer(this.requestListener)
        .listen(port, host, () => {
          console.log(`## Mini-express running at ${host}\:${port}. ##`)
        })
  }
}
```

以上就基本实现了路由池的功能, 关键思路自己以前有想到过了.
刚好最近看了一篇[文章](https://saul-mirone.github.io/2017/01/08/express-core/), 里面提到了中间件的实现思路,
可以改进一下以上的代码.

以前自己用 express 时没有很深入, 对 `app.use` 方法的了解只是: 它是一个针对全局所有路由的逻辑, 可以用于增强, 修改或过滤请求,
例如:

```javascript
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({/* ... */}))
```

实际上 use 方法可以指定第一个参数为路径, 只针对符合该路径的路由进行处理. 上面代码的中间件增强了所有路由的请求对象的
`body`, `cookie` 和 `session`, 省略掉了路径参数.
所以一个典型的中间件使用方法是这样的:

```javascript
const app = express()
// 添加中间件
app.use('/secret', (req, res) => {
  if (/* 校验通过 */) {
    next()
  } else {
    res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8'})
    res.end('Unauthorized.')
  }
})
app.get('/secret', (req, res) => {
  res.end('Secret!')
})
```

`app.use` 和 `app.get` 的用法很像, 那么为什么不把 use 也看成一个路由的方法呢？
`use` 的特性之一是它所接受的监听函数参数, 可以接受第三个参数 `next`. next
也是[生成器函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*)
所返回的[生成器对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator)
的方法之一:

```javascript
const generator = function* (arr) {
  yield* arr
}
const gen = generator([1, 2, 3])
gen.next() // {value: 1, done: false}
gen.next() // {value: 2, done: false}
gen.next() // {value: 3, done: false}
gen.next() // {value: undefined, done: true}
```

调用一个生成器函数并不会马上执行它里面的语句, 而是返回一个该生成器的迭代器(iterator)对象, 它的 next 方法会返回一个对象,
其 value 是迭代器返回的值, 迭代结束后为为 `undefined`. 由于传给了
generator 方法一个可迭代的数组为参数, 其中的 `yield*` 表达式就会依次返回该数组的项. 在连续两次 `next()` 调用之间,
迭代器对象是被'暂停'后恢复执行的. 根据这个特点, 我们对
getRouterHandler 方法修改如下:

```javascript
class MiniExpress {
  constructor() {
    // ...
  }

  getRouterHandler(targetMethod, targetPath) {
    const generator = function* (arr) {
      yield* arr
    }
    const routeIterator = generator(this.routes)
    return (req, res) => {
      ;(function next() {
        const thisRoute = routeIterator.next().value
        // 1 - 已经遍历结束
        if (thisRoute === undefined) {
          res.end(`Cannot ${targetMethod} ${targetPath}`)
          return
        }
        const {method, path, handler} = thisRoute
        // 2 - 匹配到了符合的路由
        if ([targetMethod, 'all'].includes(method) && [targetPath, '*'].includes(path)) {
          handler(req, res)
          return
        }
        // 3 - 匹配到了中间件
        if (method === 'use' && [targetPath, '/'].includes(path)) {
          handler(req, res, next)
          return
        }
        next()
      }())
    }
  }

  requestListener(req, res) {
    // ...
  }

  listen(port = 4000, host = 'localhost') {
    // ...
  }
}
```

如上, 使用路由迭代器 routeIterator 代替路由数组的 `for in` 循环. 在 `app.use()` 时, next 会被传入 handler 作为第三个参数.
在业务逻辑内可以进行条件判断, 满足条件时调用
next(), 将执行权交给路由迭代器. 这时迭代器会从前面暂停的地方————也就是这个 use. 路由对象的下一个路由继续迭代；如不满足条件则抛出异常或以一个错误信息结束响应,
next 不会被调用, 自然也不会执行暂停位置之后的路由.

因此, 为某个路由添加中间件的逻辑, 必须位于该路由的实际请求处理逻辑之前. 如果对下面代码的 use 和 get 语句交换位置,
则该中间件永远不会生效.

```javascript
app.use('/secret', (req, res, next) => {
  // ...
})
app.get('/secret', (req, res) => {
  // ...
})
```

## 增强请求和响应对象

express 提供的 Response 和 Request 接口, 实际上就是对上文提到的原生 `ClientRequest` 和 `ServerResponse` 的一定程度的封装.
所以在实际使用 MiniExpress 框架时,
可以按需添加一些方法, 以实现对它们的增强, 用增强后的对象代替 getRouterHandler 中执行路由处理函数时传入的原生对象.   
例如实现 express 的 `res.json` 方法:

```javascript

// 增强 res, 可按需添加其它方法
const enhanceRes = (res) => {
  // 以 json 结束响应
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
  }
  return res
}

class MiniExpress {
  getRouterHandler() {
    // ...
    handler(req, enhanceRes(res))
    // ...
  }
}
```

根据实际需要对 req 也进行类似的处理即可.

## 总结

以上只实现了 express 很基础的功能, 像静态文件处理, 模板渲染这里都没有实现, 到实际项目中再按需添加吧. 不过大部分 express
可用的中间件在这个框架中也是可用的.

完整代码在[这里](https://github.com/youknowznm/mini-express/blob/master/mini-express.js). 
