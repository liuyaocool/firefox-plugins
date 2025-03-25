browser.browserAction.onClicked.addListener((tab) => {
    browser.tabs.create({url: "config.html"});
    // browser.runtime.openOptionsPage();
});

let proxy_config;

browser.runtime.onMessage.addListener((data, sender, resp) => {
    switch(data.type) {
        case 'save_proxy':
            setLocalConfig(data.data);
            resp('保存完成');
            break;
        default: break;
    }
});

browser.storage.local.get([STORE_KEY_CONFIG]).then(res => {
    if (res) setLocalConfig(res[STORE_KEY_CONFIG]);
});

function setLocalConfig(configJsonText) {
    if(!configJsonText) return;
    proxy_config = handleConfig(configJsonText);
    console.log(proxy_config);
}

browser.proxy.onRequest.addListener(req => {
    let p = null;
    for (let i = 0; i < req.requestHeaders.length; i++) {
        if (req.requestHeaders[i].name == "Referer") {
            p = matchProxyByUrl(req.requestHeaders[i].value, proxy_config);
            // console.log(`${req.requestHeaders[i].value}`);
            break;
        }
    }
    if (!p) {
        p = matchProxyByUrl(req.url, proxy_config);
    }
    // console.log(`${p[0].type} :: ${req.method} ${req.url}`);
    return p;
    // return [{type: "http", host: "127.0.0.1", port: 65535}];
}, {urls: ["<all_urls>"]}
, ["requestHeaders"]);