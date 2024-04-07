const M3U8_MAP = {};

checkIfExclude(location.host, () => {
    addListenerOnMessage((type, data, sender, response) => {
        switch(type) {
            case 'url': addM3u8(data.url, data.contentType); break;
            default: break;
        }
    })

    function addM3u8(url, contentType) {
        if (M3U8_MAP[url]) return;
        console.log(url);
        switch (contentType) {
            case 'application/vnd.apple.mpegurl':
                M3U8_MAP[url] = new M3u8Handler(url, getName()).init();
                break;
            case 'video/mp4':
            case 'video/webm':
                M3U8_MAP[url] = new Mp4Handler(url, getName());
                break;
            default:
        }
    }

    function getName() {
        try {
            return window.top == window ? window.document.title : window.top.document.title;
        } catch (e) {
            return 'video';
        }
    }
    
    console.log("m3u8插件已监听消息");
});

/**
 * 校验是否被排除
 * @param configStr 配置字符串
 * @param host 域名
 * @return {boolean} true:已排除 false:未排除
 */
function checkIfExclude(host, success) {
    storageGet(["ly_m3u8_options"], res => {
        if (!res['ly_m3u8_options']) {
            success();
            return;
        }
        let line = res['ly_m3u8_options'].split('\n'), hosts;
        for (let i = 0; i < line.length; i++) {
            hosts = line[i].split(',');
            for (let j = 0; j < hosts.length; j++) {
                if (hosts[j].trim() == host) {
                    return;
                }
            }
        }
        success();
    });
}