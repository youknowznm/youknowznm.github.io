# webpack require 的大小写敏感问题

## 问题

维护一个 react 老项目时, 遇到了本地开发环境正常, 测试环境进入指定的路由, 按需加载模块时, 报 `module not found` 的错误.

排查后发现 `require` 的路径和实际路径的大小写不一致, 修复后问题解决.

原因很简单, 就是 Linux 文件系统大小写敏感, Windows 和 MacOS 不敏感.

## 处理方案

善用现代编辑器的自动补全, 一般不会出现这种问题.  
谨慎起见, 也可以考虑加个 [CaseSensitivePathsPlugin](https://github.com/Urthen/case-sensitive-paths-webpack-plugin),
在本地开发时提前发现.

## 发散

大小写不敏感还可能导致其它开发中的问题. 例如, 在 MacOS 系统中修改仓库中的文件名, 比如: `view.js` -> `View.js`, 会发现
git status 并没有变更.

简易的解决方案是: 先将文件重命名为另外的一个名称, 再执行一次重命名改回正确的文件名. 比如将 `view.js` 改成 `viewxxx.js`,
commit 后再改成 `View.js`.

其它方案可参考[这里](https://stackoverflow.com/questions/17683458/how-do-i-commit-case-sensitive-only-filename-changes-in-git),
但综合来看还不如上面的步骤.


