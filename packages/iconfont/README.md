# @antmjs/iconfont

> 生成可以在 Taro 里面使用的 Iconfont

### 为什么需要

iconfont 默认在小程序里面是不支持的，用它的好处是避免用图片来请求，而且图片资源更大

### 安装

```bash
pnpm add @antmjs/iconfont --dev
```

### 配置

##### 注：在执行该脚本的目录需要添加 antm.config.js 文件

```javascript
module.exports = {
  iconfont: {
    src: '使用iconfont的Symbol链接，即//***.js',
    fontFamily: 'iconfont',
    fontClassPrefix: 'icon',
    typescript: true,
    components: './src/components/icon',
    style: './src/iconfont.scss',
    defaultSize: 48,
    defaultColor: '#969799',
  },
}
```

### 资源上传
```bash
antm-icon

antm-icon --no-rn

```

### 使用
1. 将样式文件引入app.scss|app.less，路径根据实际情况更改
``` scss
/*  #ifndef rn */
@import './iconfont.scss';

/*  #endif */
```
2. 在页面中引入，路径根据实际情况更改
```jsx
import { Icon } from 'components/icon'

<Icon name="xxx" size={48} color="#000" />
```
