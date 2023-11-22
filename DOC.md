# 开发文档
https://developer.mozilla.org/zh-CN/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension

# 文件说明

## manifest.json

```json
{
    "manifest_version": 2,
    "name": "插件名称",
    "version": "1.0",
    "description": "插件描述",
    // 打包插件必填
    "browser_specific_settings": {
      "gecko": {
        "id": "pluginname.61linux.com",
        "strict_min_version": "54.0"
      }
    },
    "icons": {
        "48": "img/icon48.png",
        "96": "img/icon96.png"
    },
    "browser_action": {
        "browser_style": true,
        "default_area": "navbar",
        "default_icon": {
            "16": "img/logo16.png",
            "32": "img/logo32.png"
        },
        "default_title": "鼠标hover提示",
        "default_popup": "popup.html"
    },
    // 注入页面的脚本
    "content_scripts": [
        {
            // 同时注入所有子页面中(<iframe></iframe>)
            "all_frames": true,
            // document_start document_end
            "run_at": "document_idle",
            "matches": ["<all_urls>", "*://*.mozilla.org/*"],
            "js": ["js/inject.js"],
            "css": ["css/inject.css"]
        }
    ],
    "background": {
        "page" : "background.html",
        "scripts": ["js/background.js"]
    },
    // 权限
    "permissions": [
        "activeTab",
        "declarativeContent",
        "scripting",
        "contextMenus", //自定义创建右键菜单API
        "tabs", //tab选项卡API
        "storage", //缓存API
        "webRequest" //监听浏览器请求API
        // ...
    ]
}
```

# 方法

