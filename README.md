# 插件列表

- m3u8: m3u8视频下载
- postman: 发送http请求
- proxy: 代理
- translate: 划词翻译
- work: 工作相关-仅供个人

# 安装说明

打包插件需在manifest.json中添加配置

```json
"browser_specific_settings": {
    "gecko": {
        "id": "pluginname:61linux.com",
        "strict_min_version": "54.0"
    }
},
```

步骤：

1. 进入插件目录(manifest.json 同级), 执行 `zip -r -FS work.zip *`
2. 非开发版firefox需要提交插件市场校验
3. 开发版firefox
    1. 浏览器打开 `about:config`
    2. 设置 `xpinstall.signatures.required=false`
    3. 安装本地插件 *.zip
