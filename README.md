### 安装`electron`常见问题

#### 安装慢切换镜像源


```bash
# ==========================================================
# NPM
# ==========================================================
npm set home https://registry.npmmirror.com # 注册模块镜像
npm set registry https://registry.npmmirror.com # 注册模块镜像
npm set disturl https://npmmirror.com/dist # node-gyp 编译依赖的 node 源码镜像
## 以下选择添加
npm set electron_mirror https://npmmirror.com/mirrors/electron/ # electron 二进制包镜像
npm set puppeteer_download_host https://npmmirror.com/mirrors # puppeteer 二进制包镜像
npm set chromedriver_cdnurl https://npmmirror.com/mirrors/chromedriver # chromedriver 二进制包镜像
npm set node_inspector_cdnurl https://npmmirror.com/mirrors/node-inspector # node-inspector 二进制包镜像
npm set python_build_mirror_url="https://registry.npmmirror.com/-/binary/python/"
npm cache clean --force # 清空缓存

# ==========================================================
# YARN
# ==========================================================
yarn config set registry https://registry.npmmirror.com # 注册模块镜像
yarn config set disturl https://npmmirror.com/dist # node-gyp 编译依赖的 node 源码镜像
## 以下选择添加
yarn config set electron_mirror https://npmmirror.com/mirrors/electron/ # electron 二进制包镜像
yarn config set puppeteer_download_host https://npmmirror.com/mirrors # puppeteer 二进制包镜像
yarn config set chromedriver_cdnurl https://npmmirror.com/mirrors/chromedriver # chromedriver 二进制包镜像
yarn config set node_inspector_cdnurl https://npmmirror.com/mirrors/node-inspector # node-inspector 二进制包镜像
yarn config set python_build_mirror_url="https://registry.npmmirror.com/-/binary/python/"
yarn cache clean # 清空缓存
```

#### 如果安装过程中有类似以下提示

```
npm ERR! code EPERM
npm ERR! syscall rename
```

那么需要以管理员模式运行命令安装。

# 配置说明

## LOGO 修改

1. `\build`目录下`ico`文件

2. `\src\main\icon\`目录下`logo.png`文件

## 名称修改

`\package.json`中修改

## 资源目录

`\src\renderer`为 html 资源目录
确保该资源能通过`file`协议访问

## 个性配置

如果要全屏、或者其他的特殊需求，可在`/src/index.js`文件中修改。
具体参数请移步查阅：[https://www.electronjs.org/docs/api/browser-window](https://www.electronjs.org/docs/api/browser-window)

# 运行

## 调试运行

```
npm run dev
```

## 打包

```
npm run build
```
